import React, { useState } from 'react';
import signupValidator from '../validator/signupValidator';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const initialFormData = { name: "", email: "", password: "", confirmPassword: "" };
const initialFormError = { name: "", email: "", password: "", confirmPassword: "" };

const Signup = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const errors = signupValidator({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });

    if (errors.name || errors.email || errors.password || errors.confirmPassword) {
      setFormError(errors);
    } else {
      try {
        setLoading(true);
        const reqBody = {
          name: formData.name,
          email: formData.email,
          password: formData.password}
        const response = await axiosInstance.post("/auth/signup",reqBody)
        const data = response.data;
        toast.success(data.message,{position: "bottom-center", autoClose: true})
        setFormData(initialFormData)
        setFormError(initialFormError);
        setLoading(false)
        navigate("/login")
      } catch (error) {
        setLoading(false)
        const response = error.response;
        const data = response.data;
        toast.error(data.message,{position: "bottom-center", autoClose: true})
       console.log(error.message) 
      }
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto mt-12 lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create an account
            </h1>
            <form className="space-y-4 md:space-y-6" action="#" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {formError.name && <p className='text-red-500'>{formError.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="example@gmail.com"
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
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-white"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </span>
                </div>
                {formError.password && <p className='text-red-500'>{formError.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="***********"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <span
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-white"
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </span>
                </div>
                {formError.confirmPassword && <p className='text-red-500'>{formError.confirmPassword}</p>}
              </div>

              <button type="submit" className="w-full text-white bg-primary-600 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-blue-500 dark:focus:ring-primary-800" >
              {loading ? "Saving..." : "Sign Up"}
              </button>
            </form>
            <p className="text-blue-500 hover:text-blue-600 dark:text-blue-400 text-center cursor-pointer" 
            onClick={() => navigate("/login")}>
              Already have an account? Login
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
