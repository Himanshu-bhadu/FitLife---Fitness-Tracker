import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { Button, TextField, Divider } from "@mui/material";
import toast from "react-hot-toast"; 
import api from "../api/axios";

const ProfilePage = () => {
  const navigate = useNavigate(); 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [profilePic, setProfilePic] = useState("");
  const [name, setName] = useState("");
  
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/user/me');
      const userData = response.data.data;
      setUser(userData);
      setProfilePic(userData.profilePic || "");
      setName(userData.name || ""); 
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile"); 
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadToast = toast.loading("Uploading image...");

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      setProfilePic(base64String);
      
      try {
        await api.put('/api/user/me', { profilePic: base64String });
        toast.success("Profile picture updated!", { id: uploadToast });
      } catch (error) {
        console.error("Error updating profile pic:", error);
        toast.error("Failed to update picture", { id: uploadToast });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateName = async () => {
    if (!name.trim()) return toast.error("Name cannot be empty"); 

    try {
      await api.put('/api/user/me', { name });
      toast.success("Name updated successfully!"); 
      setUser({ ...user, name });
    } catch (error) {
      console.error("Error updating name:", error);
      toast.error("Failed to update name"); 
    }
  };

  const handleChangePassword = async () => {
    const { oldPassword, newPassword, confirmNewPassword } = passwords;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return toast.error("Please fill in all fields"); 
    }

    if (newPassword !== confirmNewPassword) {
      return toast.error("New passwords do not match"); 
    }

    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters"); 
    }

    const loadingToast = toast.loading("Updating password..."); 

    try {
      await api.put('/api/user/me/password', {
        oldPassword,
        newPassword
      });
      toast.success("Password changed successfully!", { id: loadingToast }); 
      setPasswords({ oldPassword: "", newPassword: "", confirmNewPassword: "" }); 
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error.response?.data?.message || "Failed to change password", { id: loadingToast }); 
    }
  };

  const handleDeleteAccount = async () => {
    const isConfirmed = window.confirm(
      "⚠️ ARE YOU SURE?\n\nThis will permanently delete your account, nutrition logs, and workout history.\nThis action cannot be undone."
    );

    if (!isConfirmed) return;

    const loadingToast = toast.loading("Deleting account...");

    try {
      await api.delete("/api/user/me");
      
      toast.success("Account deleted. Goodbye! 👋", { id: loadingToast });

      localStorage.removeItem("accessToken"); 
      localStorage.removeItem("refreshToken"); 
      
      setTimeout(() => {
        navigate("/register");
      }, 1000);

    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete account", { id: loadingToast });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-300 flex flex-col items-center p-4 md:p-8">
      
      <div className="bg-red-50 p-5 md:p-8 rounded-2xl shadow-xl w-full max-w-lg mb-10">
        
        <div className="w-full flex items-center justify-start mb-4">
          <button 
            onClick={() => navigate("/dashboard")}
            className="bg-white text-indigo-600 px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base rounded-lg font-semibold shadow-sm hover:shadow-md transition border border-indigo-100 flex items-center gap-2"
          >
            ← Dashboard
          </button>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-indigo-700">Edit Profile</h1>

        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <img
              src={profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              alt="profile"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full shadow-lg border-4 border-indigo-100 object-cover"
            />
            <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 shadow-md transform hover:scale-110 transition">
              📷
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
          <p className="text-gray-500 mt-2 text-sm md:text-base">{user?.email}</p>
        </div>

        <Divider sx={{ mb: 4 }} />

        <div className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Personal Details</h2>
          <div className="space-y-4">
            <TextField
              fullWidth
              label="Full Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="medium" 
            />
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleUpdateName}
              fullWidth 
              size="large"
              sx={{ bgcolor: '#4f46e5', '&:hover': { bgcolor: '#4338ca' } }}
            >
              Update Name
            </Button>
          </div>
        </div>

        <Divider sx={{ mb: 4 }} />

        <div className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Security</h2>
          <div className="space-y-4">
            <TextField
              fullWidth
              type="password"
              label="Old Password"
              variant="outlined"
              value={passwords.oldPassword}
              onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})}
            />
            <TextField
              fullWidth
              type="password"
              label="New Password"
              variant="outlined"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
            />
            <TextField
              fullWidth
              type="password"
              label="Confirm New Password"
              variant="outlined"
              value={passwords.confirmNewPassword}
              onChange={(e) => setPasswords({...passwords, confirmNewPassword: e.target.value})}
            />
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth
              size="large"
              onClick={handleChangePassword}
            >
              Change Password
            </Button>
          </div>
        </div>

        <Divider sx={{ mb: 4 }} />

        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
          <h2 className="text-base md:text-lg font-bold text-red-700 mb-2">Danger Zone</h2>
          <p className="text-xs md:text-sm text-red-600 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button 
            variant="contained" 
            color="error" 
            fullWidth
            size="large"
            onClick={handleDeleteAccount}
            sx={{ fontWeight: 'bold' }}
          >
            Delete Account
          </Button>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;

