import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useAuth } from "../../components/context/AuthContext";

const DetailPost = () => {
  const navigate = useNavigate();
  const params = useParams();
  const postId = params.id;
  const [post, setPost] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [fileId, setFileId] = useState(null);

  const auth = useAuth();
  const userIdAuth = auth?._id;

  useEffect(() => {
    if (postId) {
      const getPost = async () => {
        try {
          const response = await axiosInstance.get(`/post/${postId}`);
          const data = response.data.data;
          setPost(data.post);

          // Handle file differently with Cloudinary
          if (data.post.file) {
            // Store the file ID for deletion purposes
            setFileId(data.post.file._id);
            
            // If the file object has a URL property (from Cloudinary), use it directly
            if (data.post.file.url) {
              setFileUrl(data.post.file.url);
            } 
            // Fall back to the old method if needed
            else if (data.post.file._id) {
              // This will trigger the second useEffect to fetch the URL
              // We don't set fileUrl here as the second useEffect will handle it
            }
          }
        } catch (error) {
          const response = error.response;
          const data = response?.data;
          toast.error(data?.message || "Failed to load post", { position: "bottom-center", autoClose: true });
        }
      };
      getPost();
    }
  }, [postId]);

  // Only use this effect if we don't have a direct URL from Cloudinary
  useEffect(() => {
    // Only fetch the signed URL if we have a post with a file but no fileUrl yet
    if (post && post.file && post.file._id && !fileUrl) {
      const getFile = async () => {
        try {
          const response = await axiosInstance.get(`/file/file-url/${post.file._id}`);
          const data = response.data.data;
          setFileUrl(data.url || data.signedUrl); // Handle both new and old response formats
        } catch (error) {
          console.log("Error fetching file URL:", error);
          // Don't show toast for file errors, just log them
          // This avoids excessive error messages for users
        }
      };
      getFile();
    }
  }, [post, fileUrl]);

  const handleDelete = async () => {
    if (!selectedPost) return;
  
    try {
      if (fileId) {
        await axiosInstance.delete(`/file/delete-file/${fileId}`);
      }
      await axiosInstance.delete(`/post/${selectedPost._id}`);
      toast.success("Post deleted successfully", {
        position: "bottom-center",
        autoClose: true,
      });
      setShowModal(false);
      navigate("/post");
    } catch (error) {
      const response = error.response;
      const data = response?.data;
      toast.error(data?.message || "An error occurred while deleting the post", {
        position: "bottom-center",
        autoClose: true,
      });
    }
  };

  if (!post) {
    return <div className="flex justify-center items-center text-white text-lg font-bold">
    Loading...</div>; 
  }

  const createdAt = new Date(post.createdAt).toLocaleString();
  const updatedAt = new Date(post.updatedAt).toLocaleString();
  const isSameTime = createdAt === updatedAt;
  const userIdPost = post?.updatedBy._id;
  
  return (
    <div className="px-4 py-6 md:px-8 md:py-10">
      <div className="mb-6 flex justify-center space-x-4">
        <button className="w-32 text-white bg-gray-600 hover:bg-blue-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center" onClick={() => navigate(-1)}>
          Go Back
        </button>
        {userIdAuth === userIdPost ? (
          <>
          <button className="w-32 text-white bg-gray-600 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center" onClick={() => navigate(`/post/update-post/${postId}`)}>
            Update
          </button>
          <button className="w-32 text-white bg-gray-600 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
          onClick={() => {
            setSelectedPost(post);
            setShowModal(true);
          }}>
            Delete
          </button>
        </>
        ) : null}  
        
      </div>
      <div className="bg-blue-100 shadow-md rounded-lg p-6 md:p-8">
        <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-gray-900 md:text-2xl text-center mb-4">
          {post.title}
        </h2>
        <div className="space-y-2 text-gray-700 dark:text-gray-700">
          <h5 className="text-sm">
            <span className="font-semibold">Category:</span> {post.category.title}
          </h5>
          <h5 className="text-sm">
            <span className="font-semibold">Description:</span> {post.description}
          </h5>
        </div>
        <br />
        <p
          className="mt-4 text-sm text-gray-900 dark:text-gray-900"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        {fileUrl && (
          <img
            className="mt-6 w-full max-h-80 object-contain rounded-lg shadow-sm"
            src={fileUrl}
            alt="Post Image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              console.log("Failed to load image");
            }}
          />
        )}

        <br />
        <div className="space-y-2 text-gray-700 dark:text-gray-700">
          <h5 className="text-sm">
            <span className="font-semibold">Written by:</span> {post.updatedBy.name}
          </h5>
          <h5 className="text-sm">
            <span className="font-semibold">Created at:</span> {createdAt}
          </h5>
          {!isSameTime && (
            <h5 className="text-sm">
              <span className="font-semibold">Updated at:</span> {updatedAt}
            </h5>
          )}
        </div>
      </div>
      {showModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4 text-center">
            Are you sure you want to delete this post?
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

export default DetailPost;