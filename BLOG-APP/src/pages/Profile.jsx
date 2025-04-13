import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import testImage from "../assets/image/testImage.jpg"; 
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../components/context/AuthContext";
import profileValidator from "../validator/profileValidator";

const initialFormData = { name: "", email: ""};
const initialFormError = { name: "", email: "" };

const Profile = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(testImage);
  const [fileId, setFileId] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const [extensionError, setExtensionError] = useState(null);
  const [isProfileUpdated, setIsProfileUpdated] = useState(false);

  const auth = useAuth();

  // Fetch current user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get current user data
        const currentUserResponse = await axiosInstance.get("/auth/current-user");
        const userData = currentUserResponse.data.data.user;
        
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
        });

        // Try to get profile picture
        try {
          const res = await axiosInstance.get("/auth/profile-pic");
          if (res.data && res.data.data && res.data.data.profilePic) {
            const profilePic = res.data.data.profilePic;
            setFileId(profilePic._id || profilePic.id);
            
            // Get signed URL for the profile picture
            try {
              const picId = profilePic._id || profilePic.id;
              const response = await axiosInstance.get(`/file/signed-url/${picId}`);
              const { status, data } = response.data;

              if (status && data && (data.signedUrl || data.url)) {
                setProfileImage(data.signedUrl || data.url);
                setFileName(picId);
              } else {
                setProfileImage(testImage);
              }
            } catch (error) {
              console.error("Error fetching signed URL:", error);
              setProfileImage(testImage);
            }
          }
        } catch (error) {
          console.error("Error fetching profile pic:", error);
          setProfileImage(testImage);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setProfileImage(testImage);
        toast.error("Failed to load profile data", { position: "bottom-center", autoClose: true });
      }
    };

    fetchProfile();
  }, [isProfileUpdated]); // Re-fetch when profile is updated

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validExtensions = ["image/jpeg", "image/jpg", "image/png"];
    if (!validExtensions.includes(file.type)) {
      setExtensionError("Only '.png', '.jpg', '.jpeg' allowed");
      return;
    }

    setExtensionError(null);
    setIsDisable(true);

    try {
      // Delete existing file if there is one
      if (fileId) {
        try {
          await axiosInstance.delete(`/file/delete-file/${fileId}`);
        } catch (deleteError) {
          console.error("Error deleting existing file:", deleteError);
          // Continue with upload even if delete fails
        }
      }
      
      // Upload new file
      const formData = new FormData();
      formData.append("image", file);
      
      const uploadResponse = await axiosInstance.post("/file/upload-file", formData);
      console.log("Upload response:", uploadResponse.data);
      
      if (!uploadResponse.data.status) {
        throw new Error(uploadResponse.data.message || "Upload failed");
      }
      
      const fileData = uploadResponse.data.data;
      
      // Store file ID in multiple formats to ensure we have what we need
      const newFileId = fileData._id || fileData.id;
      setFileId(newFileId);
      setFileName(newFileId);
      
      // Get the URL for the newly uploaded image
      const urlResponse = await axiosInstance.get(`/file/signed-url/${newFileId}`);
      console.log("URL response:", urlResponse.data);
      
      if (urlResponse.data.status && urlResponse.data.data) {
        const imageUrl = urlResponse.data.data.signedUrl || urlResponse.data.data.url;
        setProfileImage(imageUrl);
      }
      
      toast.success("Image uploaded successfully", { position: "bottom-center", autoClose: true });
    } catch (error) {
      console.error("File change error:", error);
      setProfileImage(testImage);
      toast.error(error.response?.data?.message || "File upload failed", { position: "bottom-center", autoClose: true });
    } finally {
      setIsDisable(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = profileValidator(formData);

    if (errors.name || errors.email) {
      setFormError(errors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Prepare update data
      let updateData = { ...formData };
      
      // Only include profilePic if we have a valid file ID
      if (fileName) {
        updateData.profilePic = fileName;
      }
      
      console.log("Submitting profile update with data:", updateData);
      
      // Update profile
      const response = await axiosInstance.put("/auth/update-profile", updateData);
      console.log("Update response:", response.data);
      
      if (!response.data.status) {
        throw new Error(response.data.message || "Update failed");
      }
      
      // Get updated user data
      const authResponse = await axiosInstance.get("/auth/current-user");
      const updatedUser = authResponse.data.data.user;
      
      // Update local storage
      let userData = JSON.parse(localStorage.getItem('UserData'));
      if (userData) {
        userData.user = updatedUser;
        localStorage.setItem('UserData', JSON.stringify(userData));
        
        // Trigger storage event to update other components
        window.dispatchEvent(new Event('storage'));
      }
      
      setIsProfileUpdated(prev => !prev); // Toggle to trigger re-fetch
      toast.success("Profile updated successfully", { position: "bottom-center", autoClose: true });
      navigate("/post");
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile", { position: "bottom-center", autoClose: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 mt-10 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6">
          <button
            className="text-white bg-gray-600 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2 text-center"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>

          <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Update Profile
          </h2>

          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div className="flex items-center justify-center space-x-2">
              <img
                src={profileImage}
                alt="Profile"
                className="w-36 h-36 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500 object-cover"
              />
            </div>

            <div className="form-group">
              <label htmlFor="file_input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Upload image
              </label>
              <input
                className="block w-full text-sm text-gray-900 border border-gray-700 rounded-lg cursor-pointer bg-gray-700 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                id="file_input"
                type="file"
                onChange={handleFileChange}
                disabled={isDisable}
              />
              {extensionError && <p className="text-red-500">{extensionError}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Name
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
              />
              {formError.name && <p className="text-red-500">{formError.name}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Email
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="email"
                name="email"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={handleChange}
              />
              {formError.email && <p className="text-red-500">{formError.email}</p>}
            </div>

            <div className="form-group">
              <input
                className={`w-full text-white bg-primary-600 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-blue-500 dark:focus:ring-primary-800 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                type="submit"
                value={isLoading ? "Updating..." : "Update"}
                disabled={isLoading}
              />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Profile;