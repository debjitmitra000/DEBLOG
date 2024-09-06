import { useNavigate,useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import { convert } from "html-to-text";
import { useAuth } from "../../components/context/AuthContext";

const PostList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState([]);
  const [searchvalue, setSearchvalue] = useState("");
  const [posts, setPosts] = useState([]);

  const auth = useAuth();
  const userverification = auth?.isVerified;

  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        
        const response = await axiosInstance.get(
          `/post?page=${currentPage}&search=${searchvalue}${category ? `&category=${category}` : ""}`
        );
        const data = response.data.data;
        setPosts(data.posts);
        setTotalPage(data.totalPages);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        const response = error.response;
        const data = response ? response.data : null;
        toast.error(data ? data.message : "An error occurred while fetching posts", {
          position: "bottom-center",
          autoClose: true,
        });
      }
    };

    fetchPosts();
  }, [currentPage,searchvalue,category]);

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
        `/post?search=${input}&page=${currentPage}${category ? `&category=${category}` : ""}`
      );
      const data = response.data.data;
      setPosts(data.posts);
      setTotalPage(data.totalPages);
    } catch (error) {
      const response = error.response;
      const data = response.data;
      toast.error(data.message, { position: "bottom-center", autoClose: true });
    }
  };

  const handleVerificationCheck = ()=>{
    if(userverification === true){
      navigate("/post/new-post");
    } else{
      navigate("/verify-user");
    }
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-10">
      <div className="mb-6 flex justify-center">
        <button className="w-44 text-white bg-gray-600 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center" 
        onClick={handleVerificationCheck}>
          Add New Post
        </button>
      </div>

      <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white mb-6 text-center">
        Post List
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

      <div className="block sm:grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {loading ? (
            <div className="flex justify-center items-center text-white text-lg font-bold">
              Loading...
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
            <div
              key={post._id}
              className="bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-lg p-3 mb-4 md:mb-0"
              onClick={()=>navigate(`/post/post-detail/${post._id}`)}
            >
              <h4 className="font-bold text-white text-sm mb-2">{post.title}</h4>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">
              {post.description.substring(0,80)}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">
              {convert(post.content, {
                  wordwrap: true,
                }).substring(0, 320)}
              </p>
            </div>
          ))):(
            <div className="text-center text-gray-600 dark:text-gray-400">
              No posts found 
            </div>
          )
        }
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
    </div>
  );
};

export default PostList;
