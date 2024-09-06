import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../components/context/AuthContext"; 

const CategoryList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState([]);
  const [searchvalue, setSearchvalue] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const auth = useAuth();
  const userRole = auth?.role;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/category?page=${currentPage}&search=${searchvalue}`
        );
        const data = response.data.data;
        setCategories(data.categories);
        setTotalPage(data.totalPages);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        const response = error.response;
        const data = response.data;
        toast.error(data.message, {
          position: "bottom-center",
          autoClose: true,
        });
      }
    };

    fetchCategories();
  }, [currentPage]);

  useEffect(() => {
    if (totalPage > 1) {
      let tempPageCount = [];
      for (let i = 1; i <= totalPage; i++) {
        tempPageCount = [...tempPageCount, i];
      }
      setPageCount(tempPageCount);
    } else {
      setPageCount([]);
    }
  }, [totalPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSearch = async (e) => {
    try {
      const input = e.target.value;
      setSearchvalue(input);
      const response = await axiosInstance.get(
        `/category?search=${input}&page=${currentPage}`
      );
      const data = response.data.data;
      setCategories(data.categories);
      setTotalPage(data.totalPages);
    } catch (error) {
      const response = error.response;
      const data = response.data;
      toast.error(data.message, { position: "bottom-center", autoClose: true });
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
  
    try {
      await axiosInstance.delete(`/category/${selectedCategory._id}`);
      setCategories(categories.filter((category) => category._id !== selectedCategory._id));
      toast.success("Category deleted successfully", {
        position: "bottom-center",
        autoClose: true,
      });
      setShowModal(false);
    } catch (error) {
      const response = error.response;
      const data = response.data;
      toast.error(data.message || "An error occurred while deleting the category", {
        position: "bottom-center",
        autoClose: true,
      });
    }
  };
  
  const handleCategoryClick = (category) => {
    navigate(`/post?category=${category._id}`);
  };

  return (
    <div className="px-4 py-6 md:px-8 md:py-10">
      
      {userRole === 1 || userRole === 2 ? (
        <div className="mb-6 flex justify-center">
          <button
          className="w-44 text-white bg-gray-600 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
          onClick={() => navigate("new-category")}
          >
            Add New Category
          </button>     
        </div>
      ) : null}   

      <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white mb-6 text-center">
        Category List
      </h2>

      <div className="mb-6 flex justify-center">
        <input
          className="w-full md:w-80 p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-600 focus:border-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          type="text"
          name="search"
          placeholder="Search here"
          onChange={handleSearch}
        />
      </div>

      {/* Mobile Card Layout */}
      <div className="block md:hidden">
        {loading ? (
          <div className="flex justify-center items-center text-white text-lg font-bold">
            Loading...
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category._id}
              className="bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-lg mb-4 p-4"
              onClick={() => handleCategoryClick(category)}
            >
              <div className="font-bold text-white text-lg mb-2">
                {category.title}
              </div>
              <div className="text-gray-600 dark:text-gray-400 mb-2">
                {category.description}
              </div>
              <div className="text-gray-500 dark:text-gray-500 mb-2">
                Created At: {new Date(category.createdAt).toLocaleString()}
              </div>
              <div className="text-gray-500 dark:text-gray-500 mb-4">
                Updated At: {new Date(category.updatedAt).toLocaleString()}
              </div>
              {userRole === 1 || userRole === 2 ? (
                <div className="flex space-x-2">
                  <button
                  className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 focus:outline-none font-medium rounded-lg text-xs px-3 py-1.5"
                  onClick={() => navigate(`update-category/${category._id}`)}
                  >
                  Update
                  </button>
                  <button className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 focus:outline-none font-medium rounded-lg text-xs px-3 py-1.5"
                  onClick={() => {
                  setSelectedCategory(category);
                  setShowModal(true);
                  }}>
                  Delete
                  </button>
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block mb-6">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center text-white text-lg font-bold">
              Loading...
            </div>
          ) : (
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    Title
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Description
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Created At
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Updated At
                  </th>
                  {userRole === 1 || userRole === 2 ? (
                  <th scope="col" className="px-4 py-3">
                    Action
                  </th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr
                    key={category._id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    onClick={() => handleCategoryClick(category)}
                  >
                    <td className="px-4 py-4">{category.title}</td>
                    <td className="px-4 py-4">{category.description}</td>
                    <td className="px-4 py-4">
                      {new Date(category.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-4">
                      {new Date(category.updatedAt).toLocaleString()}
                    </td>
                    {userRole === 1 || userRole === 2 ? (
                      <td className="px-4 py-4">
                      <div className="flex space-x-2">
                        <button
                          className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 focus:outline-none font-medium rounded-lg text-xs px-3 py-1.5"
                          onClick={() =>
                            navigate(`update-category/${category._id}`)
                          }
                        >
                          Update
                        </button>
                        <button className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 focus:outline-none font-medium rounded-lg text-xs px-3 py-1.5" 
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowModal(true);
                        }}>
                          Delete
                        </button>
                      </div>
                    </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {pageCount.length > 0 && (
        <div className="flex justify-center space-x-2 mt-8">
          <button
            className="px-4 py-2 text-white bg-gray-600 rounded-lg hover:outline-none hover:ring-2 hover:ring-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {pageCount.map((pageNumber, index) => (
            <button
              className={`px-4 py-2 text-white bg-gray-600 rounded-lg hover:outline-none hover:ring-2 hover:ring-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                currentPage === pageNumber ? "bg-blue-500" : ""
              }`}
              key={index}
              onClick={() => setCurrentPage(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
          <button
            className="px-4 py-2 text-white bg-gray-600 rounded-lg hover:outline-none hover:ring-2 hover:ring-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleNextPage}
            disabled={currentPage === totalPage}
          >
            Next
          </button>
        </div>
      )}
      {showModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4 text-center">
          Are you sure you want to delete this category?
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
            onClick={handleDelete}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default CategoryList;
