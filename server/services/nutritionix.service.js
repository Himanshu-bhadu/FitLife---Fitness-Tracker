import axios from "axios";
import qs from "qs";

const OAUTH_URL = "https://oauth.fatsecret.com/connect/token";
const API_URL = "https://platform.fatsecret.com/rest/server.api";

class FatSecretService {
  constructor() {
    this.accessToken = null;
    this.tokenExpiresAt = 0;
  }

  async getAccessToken() {
    const now = Date.now();
    
    if (this.accessToken && now < this.tokenExpiresAt - 60000) {
      return this.accessToken;
    }

    try {
      const clientId = process.env.FATSECRET_CLIENT_ID?.trim();
      const clientSecret = process.env.FATSECRET_CLIENT_SECRET?.trim();

      if (!clientId || !clientSecret) {
        throw new Error("FatSecret credentials missing in .env");
      }

      const response = await axios.post(
        OAUTH_URL,
        qs.stringify({
          grant_type: "client_credentials",
          scope: "basic",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiresAt = now + (response.data.expires_in * 1000);
      console.log("✅ New FatSecret Access Token Acquired");
      return this.accessToken;

    } catch (error) {
      console.error("FatSecret Auth Error:", error.response?.data || error.message);
      throw new Error("Failed to authenticate with FatSecret");
    }
  }

async getNutritionInfo(query) {
    try {
      console.log("Searching for:", query); 

      const token = await this.getAccessToken();

      const response = await axios.get(API_URL, {
        params: {
          method: "foods.search",
          search_expression: query,
          format: "json",
          max_results: 5,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })  ;
      
      console.log("FatSecret Raw Response:", JSON.stringify(response.data, null, 2));

      const results = response.data.foods?.food;

      if (!results) {
        console.log("❌ No food items found in response.");
        return [];
      }
      const foodArray = Array.isArray(results) ? results : [results];
      return foodArray.map((food) => {
        const description = food.food_description || "";
        
        const extract = (key) => {
          const regex = new RegExp(`${key}:\\s*([0-9.]+)`);
          const match = description.match(regex);
          return match ? parseFloat(match[1]) : 0;
        };

        return {
          name: food.food_name,
          servingQty: 1, 
          servingUnit: "serving",
          calories: extract("Calories"),
          protein: extract("Protein"),
          fat: extract("Fat"),
          carbs: extract("Carbs"),
          image: "https://cdn-icons-png.flaticon.com/512/706/706164.png", 
        };
      });

    } catch (error) {
      console.error("FatSecret API Error:", error.response?.data || error.message);
      throw new Error("Failed to fetch nutrition data");
    }
  }
}

export default new FatSecretService();