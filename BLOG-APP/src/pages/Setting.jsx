import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';
import changePasswordValidator from '../validator/changePasswordValidator';

const initialFormData = { oldPassword: "", newPassword: ""};
const initialFormError = { oldPassword: "", newPassword: "" };

const Setting = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading,setLoading] = useState(false);
  const [loadingDelete,setLoadingDelete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const errors = changePasswordValidator({
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword
    });

    if (errors.oldPassword || errors.newPassword ) {
      setFormError(errors);
    } else {
      try {
        setLoading(true);
        const response = await axiosInstance.put("/auth/change-password",formData)
        const data = response.data;

        toast.success(data.message,{position: "bottom-center", autoClose: true})
        setFormData(initialFormData)
        setFormError(initialFormError);
        setLoading(false)
        navigate("/")
      } catch (error) {
        setLoading(false)
        setFormError(initialFormError);
        const response = error.response;
        const data = response.data;
        toast.error(data.message,{position: "bottom-center", autoClose: true})
      }
    }
  };

  const handleDeleteAccount = async(e) => {
    e.preventDefault();
    try {
      setLoadingDelete(true);
      await axiosInstance.delete("/file/delete-files");
      await axiosInstance.delete("/post/delete-posts");
      const response = await axiosInstance.delete("/auth/delete-account");
      const data = response.data;
      toast.success(data.message,{position: "bottom-center", autoClose: true})
      
      window.localStorage.removeItem("UserData");
      setLoadingDelete(false)
      navigate("/login")
    } catch (error) {
      setLoadingDelete(false)
      const response = error.response;
      const data = response.data;
      toast.error(data.message,{position: "bottom-center", autoClose: true})
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 mt-28 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6">

          <button
            className="text-white bg-gray-600 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2 text-center"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>

          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Change Password
            </h2>

            <div>
              <label
                htmlFor="oldPassword"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Old Password
              </label>
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  name="oldPassword"
                  id="oldPassword"
                  placeholder="***********"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={formData.oldPassword}
                  onChange={handleChange}
                />
                <span
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 dark:text-gray-400"
                >
                  {showOldPassword ? '🙈' : '👁️'}
                </span>
              </div>
              {formError.oldPassword && <p className='text-red-500'>{formError.oldPassword}</p>}
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  id="newPassword"
                  placeholder="***********"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
                <span
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 dark:text-gray-400"
                >
                  {showNewPassword ? '🙈' : '👁️'}
                </span>
              </div>
              {formError.newPassword && <p className='text-red-500'>{formError.newPassword}</p>}
            </div>

            <button
              type="submit"
              className="w-full text-white bg-primary-600 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-blue-500 dark:focus:ring-primary-800"
              disabled={loading}
            >
              {loading ? "Changing..." : "Change"}
            </button>
          </form>

          <div className="space-y-4 md:space-y-6">
            <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Delete Account
            </h2>

            <button
              type="button" // Changed to "button" to prevent form submission
              className="w-full text-white bg-primary-600 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-blue-500 dark:focus:ring-primary-800"
              disabled={loadingDelete}
              onClick={() => setShowModal(true)} // Opens modal without submitting form
            >
              {loadingDelete ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
      
      {showModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4 text-center">
          Are you sure you want to delete Account? All posts from you will be deleted
          </h2>
          <div className="flex justify-center space-x-4">
            <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-gray-700"
            onClick={() => setShowModal(false)}
            >
              No
            </button>
            <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
            onClick={handleDeleteAccount}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
      )}
    </section>
  );
};

export default Setting;
