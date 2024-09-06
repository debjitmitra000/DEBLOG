import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';
import loginValidator from '../validator/loginValidator';
import { useNavigate } from 'react-router-dom';

const initialFormData = { email: "", password: ""};
const initialFormError = { email: "", password: "" };
const Login = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [showPassword, setShowPassword] = useState(false);
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const errors = loginValidator({
      email: formData.email,
      password: formData.password
    });

    if (errors.email || errors.password ) {
      setFormError(errors);
    } else {
      try {
        setLoading(true);
        const response = await axiosInstance.post("/auth/signin",formData)
        const data = response.data;

        window.localStorage.setItem("UserData",JSON.stringify(data.data))

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

  return (
    <section className="bg-gray-50 dark:bg-gray-900 mt-28 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Login
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
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

            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
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

            <p className="text-blue-500 hover:text-blue-600 dark:text-blue-400 text-center cursor-pointer"
            onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </p>

            <button
              type="submit"
              className="w-full text-white bg-primary-600 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-blue-500 dark:focus:ring-primary-800"
            >
              {loading ? "Loging in..." : "Login"}
            </button>
          </form>
          <p 
          className="text-blue-500 hover:text-blue-600 dark:text-blue-400 text-center cursor-pointer" 
          onClick={() => navigate("/signup")}
          >
            Do not have an account? Signup
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
