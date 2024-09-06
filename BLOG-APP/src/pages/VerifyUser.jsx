import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../components/context/AuthContext";

const VerifyUser = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("")
  const [codeError, setCodeError] = useState("")
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const auth = useAuth();
  const userEmail = auth?.email;


  const handleVerificationCode = async (e)=>{
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/send-verification-code",{email: userEmail});
      const data = response.data;
      toast.success(data.message, { position: "bottom-center", autoClose: true });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const response = error.response;
      const data = response.data;
      toast.error(data.message, { position: "bottom-center", autoClose: true });
      console.log(error.message);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code) {
      setCodeError("Verification code is required");
    } else {
      try {
        setLoadingSubmit(true);
        const response = await axiosInstance.post("/auth/verify-email", {email: userEmail, code: code});
        const data = response.data;
        setCode("");
        setCodeError("")


        const authresponse = await axiosInstance.get("/auth/current-user")
        const updateStoreUser=authresponse.data.data.user

        let userData = JSON.parse(localStorage.getItem('UserData'));
        userData.user = updateStoreUser;
        localStorage.setItem('UserData', JSON.stringify(userData));


        toast.success(data.message, { position: "bottom-center", autoClose: true });
        setLoadingSubmit(false);
        navigate("/post");
      } catch (error) {
        setCode("");
        setCodeError("")
        setLoadingSubmit(false);
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

          <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Verify User
          </h2>

          <button
            className="w-full text-white bg-gray-600 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            onClick={handleVerificationCode}
          >
            {loading ? "Sending..." : "Send Code"}
          </button>

          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="code"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Confirmation Code
              </label>
              <input
                type="text"
                name="code"
                id="code"
                placeholder="000000"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              {codeError && <p className="text-red-500">{codeError}</p>}
            </div>

            <button
              type="submit"
              className="w-full text-white bg-primary-600 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-blue-500 dark:focus:ring-primary-800"
              disabled={loadingSubmit}
            >
              {loadingSubmit ? "Verifying..." : "Verify"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default VerifyUser;
