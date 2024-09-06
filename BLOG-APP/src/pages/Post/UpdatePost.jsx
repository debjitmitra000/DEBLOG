import React, { useState, useRef, useMemo, useEffect } from "react";
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from "react-router-dom";
import JoditEditor from "jodit-react";
import addPostValidator from "../../validator/addPostValidator";

const initialFormData = { title: "", description: "", content: "", category: "", file: null };
const initialFormError = { title: "", content: "", category: "" };

const UpdatePost = () => {
  const navigate = useNavigate();
  const editor = useRef(null);
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [fileUrl, setFileUrl] = useState(null);
  const [fileId,setFileId] = useState(null)
  const [isDisable,setIsDisable] = useState(false)
  const [fileName,setFileName] = useState(null)
  const [extentionError, setExtentionError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const params = useParams();
  const postID = params.id;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditorChange = (newContent) => {
    setFormData((prev) => ({ ...prev, content: newContent }));
  };

  useEffect(() => {
    if (postID) {
      const getPost = async () => {
        try {
          const response = await axiosInstance.get(`/post/${postID}`);
          const data = response.data.data;
          setFormData({
            title: data.post.title,
            description: data.post?.description,
            content: data.post.content,
            category: data.post.category._id,
            file: data.post?.file?._id,
          });

          setFileName(data.post?.file?.id)

          if (data.post?.file) {
            const fileResponse = await axiosInstance.get(`/file/signed-url/${data.post.file.id}`);
            setFileUrl(fileResponse.data.data.signedUrl);
          }
        } catch (error) {
          const response = error.response;
          const data = response.data;
          toast.error(data.message, { position: "bottom-center", autoClose: true });
        }
      };
      getPost();
    }
  }, [postID]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(
          `/category?size=1000`
        );
        const data = response.data.data;
        setCategories(data.categories);
      } catch (error) {
        const response = error.response;
        const data = response.data;
        toast.error(data.message, {
          position: "bottom-center",
          autoClose: true,
        });
      }
    };

    fetchCategories();
  }, []);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: 'Start typing your content...',
      theme: 'white',
      toolbar: true,
      buttons: [
        'undo', 'redo', 'bold', 'italic', 'underline', 'strikethrough',
        'ul', 'ol', 'eraser', 'fontsize', 'brush', 'paragraph', 'link',
        'align', 'hr', 'superscript', 'subscript', 'table', 'spellcheck',
      ],
      buttonsXS: [
        'undo', 'redo', 'bold', 'italic', 'underline', 'strikethrough',
        'ul', 'ol', 'eraser', 'fontsize', 'brush', 'paragraph', 'link',
        'align', 'hr', 'copyformat', 'superscript', 'subscript', 'table',
        'spellcheck',
      ],
      removeButtons: ['video', 'image', 'preview', 'fullsize', 'print', 'about', 'copyformat'],
    }),
    [formData.content]
  );

  const handleFileChange = async (e) =>{
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const formInput = new FormData();
    formInput.append("image",file);
    const type = file.type;

    if (type === "image/jpeg" || type === "image/jpg" || type === "image/png") {
      setExtentionError(null);
      try {
        setIsDisable(true)
        if (fileName) {
          await axiosInstance.delete(`/file/delete-file/${fileName}`);
          setFileId(null);
          setFileUrl(null);
        }
        const response = await axiosInstance.post("/file/upload-file", formInput);
        const data = response.data;
        setFileId(data.data._id)
        setFileName(data.data.key)
        toast.success(data.message, { position: "bottom-center", autoClose: true });
        setIsDisable(false)
      } catch (error) {
        setIsDisable(false)
        const response = error.response;
        const data = response.data;
        toast.error(data.message, { position: "bottom-center", autoClose: true });
      }
    }else{
      setExtentionError("Only '.png', '.jpg', '.jpeg' allowed")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = addPostValidator({
      title: formData.title,
      content: formData.content,
      category: formData.category,
    });

    if (errors.title || errors.content || errors.category) {
      setFormError(errors);
    } else {
      try {
        setLoading(true);
        let input = formData;

        if (fileId) {
          input = { ...input, file: fileId };
        }

        const response = await axiosInstance.put(`/post/${postID}`, input);
        const data = response.data;

        toast.success(data.message, { position: "bottom-center", autoClose: true });
        setFormData(initialFormData);
        setFormError(initialFormError);
        setLoading(false);
        navigate("/post");
      } catch (error) {
        setLoading(false);
        const response = error.response;
        const data = response.data;
        toast.error(data.message, { position: "bottom-center", autoClose: true });
      }
    }
  };

  const handleGoBack = () => {
    setShowConfirmation(true);
  };

  const handleConfirmGoBack = async () => {
    setShowConfirmation(false);
    navigate(-1);
  };

  const handleCancelGoBack = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="px-4 py-6 md:px-8 md:py-10">
      <button
        className="mb-6 w-32 text-white bg-gray-600 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
        onClick={handleGoBack}
      >
        Go Back
      </button>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 md:p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
            Update Post
          </h2>

          <div className="form-group">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Title
            </label>
            <input
              className="form-control w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-600 focus:border-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              type="text"
              name="title"
              placeholder="Title of your article"
              value={formData.title}
              onChange={handleChange}
            />
            {formError.title && <p className="text-red-500">{formError.title}</p>}
          </div>

          <div className="form-group">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Description
            </label>
            <textarea
              className="form-control w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-600 focus:border-blue-600               dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="description"
              placeholder="A brief description of your article"
              rows="3"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Content
            </label>
            <JoditEditor
              ref={editor}
              value={formData.content}
              config={config}
              tabIndex={1} 
              onBlur={handleEditorChange}
            />
            {formError.content && <p className="text-red-500">{formError.content}</p>}
          </div>

          <div className="form-group">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Select a category
            </label>
            <select
            className="form-control w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-600 focus:border-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="category"
            value={formData.category}
            onChange={handleChange}
            >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.title}
              </option>
            ))}
            </select>

            {formError.category && <p className="text-red-500">{formError.category}</p>}
          </div>

          <div className="form-group">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Change image (optional)
            </label>
            {fileUrl && (
              <img
                src={fileUrl}
                alt="image"
                className="mb-4 w-48 h-32 object-cover rounded-lg"
              />
            )}
            <p className="mb-3"><span className="text-xs font-medium text-red-500 dark:text-red-500">* </span><span className="text-xs font-medium text-gray-500 dark:text-gray-500">if you change image privious one will be deleted permanently</span></p>
            
            <input
              type="file"
              className="block w-full text-sm text-gray-900 border border-gray-700 rounded-lg cursor-pointer bg-gray-700 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              onChange={handleFileChange}
              disabled={isDisable}
            />
            {extentionError && <p className="text-red-500">{extentionError}</p>}
          </div>

          <div className="form-group">
            <button
              type="submit"
              className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              disabled={loading || isDisable}
            >
              {loading ? "Updating..." : "Update Post"}
            </button>
          </div>
        </form>
      </div>
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md flex flex-col items-center">
            <p className="text-lg font-semibold mb-4 text-center">Are you sure you want to go back? All changes will be deleted.</p>
            <div className="flex justify-center space-x-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-gray-700"
                onClick={handleCancelGoBack}
              >
                No
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
                onClick={handleConfirmGoBack}
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

export default UpdatePost;

