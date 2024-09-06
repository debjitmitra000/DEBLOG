import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import addCategoryValidator from '../../validator/addCategoryValidator';

const initialFormData = { title: "", description: "" };
const initialFormError = { title: "", description: "" };

const NewCategory = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = addCategoryValidator({
      title: formData.title,
    });

    if (errors.title) {
      setFormError(errors);
    } else {
      try {
        setLoading(true);
        const response = await axiosInstance.post("/category", formData);
        const data = response.data;

        toast.success(data.message, { position: "bottom-center", autoClose: true });
        setFormData(initialFormData);
        setFormError(initialFormError);
        setLoading(false);
        navigate("/category");
      } catch (error) {
        setLoading(false);
        const response = error.response;
        const data = response.data;
        toast.error(data.message, { position: "bottom-center", autoClose: true });
        console.log(error.message);
      }
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
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            New Category
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="title"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Creative Title"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={formData.title}
                onChange={handleChange}
              />
              {formError.title && <p className="text-red-500">{formError.title}</p>}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Description
              </label>
              <textarea
                name="description"
                id="description"
                placeholder="Brief description"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full text-white bg-primary-600 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-blue-500 dark:focus:ring-primary-800"
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewCategory;
