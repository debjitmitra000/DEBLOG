import { Routes,Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css"

import PrivateLayout from "./components/layout/PrivateLayout";
import PublicLayout from "./components/layout/PublicLayout";

import Signup from "./pages/Signup";
import Login from "./pages/Login";

import Home from "./pages/Home";

import CategoryList from "./pages/category/CategoryList";
import NewCategory from "./pages/category/NewCategory";
import UpdateCategory from "./pages/category/UpdateCategory";

import PostList from "./pages/Post/PostList";
import NewPost from "./pages/Post/NewPost";
import DetailPost from "./pages/Post/DetailPost";
import UpdatePost from "./pages/Post/UpdatePost";

import Profile from "./pages/Profile";
import Setting from "./pages/Setting";
import VerifyUser from "./pages/VerifyUser";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <>
      <Routes>
        <Route element={<PrivateLayout/>}>

          <Route path="/" element={<Home/>}/>

          <Route path="/post" element={<PostList/>}/>
          <Route path="/post/new-post" element={<NewPost/>}/>
          <Route path="/post/post-detail/:id" element={<DetailPost/>}/>
          <Route path="/post/update-post/:id" element={<UpdatePost/>}/>

          <Route path="/category" element={<CategoryList/>}/>
          <Route path="/category/new-category" element={<NewCategory/>}/>
          <Route path="/category/update-category/:id" element={<UpdateCategory/>}/>

          <Route path="/profile" element={<Profile/>}/>

          <Route path="/settings" element={<Setting/>}/>

          
          <Route path="/verify-user" element={<VerifyUser/>}/>


        </Route>


        <Route element={<PublicLayout/>}>

          <Route path="/signup" element={<Signup/>}/>

          <Route path="/login" element={<Login/>}/>

          <Route path="/forgot-password" element={<ForgotPassword/>}/>

        </Route>
      </Routes>
      <ToastContainer/>
    </>
  )

}

export default App;
