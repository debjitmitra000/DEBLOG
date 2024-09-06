import axios from "axios";

const axiosInstance = axios.create({baseURL: "http://localhost:8000/api/v1"})

axiosInstance.interceptors.request.use((req)=>{
    const stringUserData = window.localStorage.getItem("UserData");

    if(stringUserData){
        const userData = JSON.parse(stringUserData)

        const token = userData.token;

        req.headers.Authorization = `Bearer ${token}`
    }
    return req
})

export default axiosInstance