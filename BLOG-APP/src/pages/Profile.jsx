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

  const auth = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setFormData({
          name: auth.name,
          email: auth.email,
        });

        const res = await axiosInstance.get("/auth/profile-pic");
        const profilePic = res.data.data.profilePic;

        if (profilePic && profilePic.id) {
          const response = await axiosInstance.get(`/file/signed-url/${profilePic.id}`);
          const { status, data } = response.data;

          if (status && data && data.signedUrl) {
            setProfileImage(data.signedUrl);
            setFileId(profilePic.id);
            setFileName(profilePic._id);
          } else {
            setProfileImage(testImage);
          }
        }
      } catch (error) {
        setProfileImage(testImage);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
  }, [fileName]);

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
      if (fileId) {
        await axiosInstance.delete(`/file/delete-file/${fileId}`);
      }
      const formData = new FormData();
      formData.append("image", file);
      
      const uploadResponse = await axiosInstance.post("/file/upload-file", formData);
      setFileId(uploadResponse.data.data.key);
      setFileName(uploadResponse.data.data._id);


      const { key } = uploadResponse.data.data;

      if (key) {
        const response = await axiosInstance.get(`/file/signed-url/${key}`);
        const { status, data } = response.data;

        if (status && data && data.signedUrl) {
          setProfileImage(data.signedUrl);
          
        } else {
          setProfileImage(testImage);
        }
      }
      toast.success(uploadResponse.data.message, { position: "bottom-center", autoClose: true });
    } catch (error) {
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
    } else {
      try {
        setIsLoading(true);

        let input = formData;

        if(fileName){
          input = {...input,profilePic: fileName}
        }


        const response = await axiosInstance.put("/auth/update-profile", input);


        const authresponse = await axiosInstance.get("/auth/current-user")
        const updateStoreUser=authresponse.data.data.user
        


        let userData = JSON.parse(localStorage.getItem('UserData'));
        userData.user = updateStoreUser;
        localStorage.setItem('UserData', JSON.stringify(userData));

        toast.success(response.data.message, { position: "bottom-center", autoClose: true });
        setFormData(initialFormData);
        setFormError(initialFormError);
        navigate("/post");
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred", { position: "bottom-center", autoClose: true });
      } finally {
        setIsLoading(false);
      }
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
                className="w-36 h-36 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
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
                placeholder="Updated name"
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
``
