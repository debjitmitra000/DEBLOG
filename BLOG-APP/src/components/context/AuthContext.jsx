import { createContext, useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export const AuthProvider = ({children}) =>{
    const [auth,setAuth] = useState(null);
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(()=>{
        const stringBlogData = window.localStorage.getItem("UserData");

        if(stringBlogData){
            const userData = JSON.parse(stringBlogData);
            const user = userData.user;
            setAuth(user);
        }else{
            setAuth(null)
        }
    },[navigate,location])
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const auth = useContext(AuthContext);
    return auth
}