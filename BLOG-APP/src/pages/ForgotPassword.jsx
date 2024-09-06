import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';
import recoverPasswordValidator from '../validator/recoverPasswordValidator ';
import { useNavigate } from 'react-router-dom';

const initialFormData = { email: "",  code: "", password: ""};
const initialFormError = { email: "", code: "", password: "" };


const ForgotPassword = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingChange, setLoadingChange] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    try {
      setLoadingSend(true);
      const response = await axiosInstance.post('/auth/forgot-password-code', { email: formData.email });
      const data = response.data;
      toast.success(data.message, { position: 'bottom-center', autoClose: true });
      setLoadingSend(false);
    } catch (error) {
      setLoadingSend(false);
      toast.error("Unable to send Code", { position: 'bottom-center', autoClose: true });
    } 
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const errors = recoverPasswordValidator({
      email: formData.email,
      code: formData.code,
      password: formData.password
    });
    if (errors.email || errors.code || errors.password ) {
      setFormError(errors);
    }else{
      try {
        setLoadingChange(true);
        const response = await axiosInstance.post('/auth/recover-password', formData);
        const data = response.data;

        toast.success(data.message, { position: 'bottom-center', autoClose: true });
        setFormData(initialFormData)
        setFormError(initialFormError);
        setLoadingChange(false);
        navigate("/login")
      } catch (error) {
        setLoadingChange(false);
        setFormError(initialFormError);
        const response = error.response;
        const data = response.data;
        toast.error(data.message, { position: 'bottom-center', autoClose: true });
      } 
    }
    
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 mt-28 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6">
          <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Recover Password
          </h2>

          <form className="space-y-4 md:space-y-6" onSubmit={handleChangePassword}>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
              <input
                type="text"
                name="email"
                id="email"
                placeholder="doe@gmail.com"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={formData.email}
                onChange={handleChange}
              />
              {formError.email && <p className='text-red-500'>{formError.email}</p>}
            </div>

            <div className="space-y-4">
              <button
                type="button"
                onClick={handleSendCode}
                className="w-full text-white bg-primary-600 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-blue-500 dark:focus:ring-primary-800"
                disabled={loadingSend}
              >
                {loadingSend ? 'Sending...' : 'Send Code'}
              </button>
            </div>

            <div>
              <label htmlFor="code" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Code</label>
              <input
                type="text"
                name="code"
                id="code"
                placeholder="123456"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={formData.code}
                onChange={handleChange}
              />
              {formError.code && <p className='text-red-500'>{formError.code}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="***********"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={formData.password}
                  onChange={handleChange}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 dark:text-gray-400"
                >
                  {showPassword ? '🙈' : '👁️'}
                </span>
              </div>
              {formError.password && <p className='text-red-500'>{formError.password}</p>}
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-blue-500 dark:focus:ring-primary-800"
                disabled={loadingChange}
              >
                {loadingChange ? 'Recovering...' : 'Recover Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
