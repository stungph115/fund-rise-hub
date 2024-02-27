import { Route, Routes } from "react-router";
import Home from "./Home/Home";
import ResetPassword from "./Auth/ResetPassword";
import ForgetPassword from "./Auth/ForgotPassword";
import SignIn from "./Auth/SignIn";
import SignUp from "./Auth/SignUp";
import NotFound from "./ErrorPage/NotFoundPage";
import ForbiddenPage from "./ErrorPage/403Page";

export default function AppRoutes({ }) {
    return (
        <Routes>
            <Route path='/home' element={<Home />} />
            <Route path='/forget-password' element={<ForgetPassword />} />
            <Route path='/reset-password/:token' element={<ResetPassword />} />
            <Route path="/signIn" element={<SignIn />} />
            <Route path="/signIn" element={<SignUp />} />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="/403" element={<ForbiddenPage />} />
        </Routes>
    )
}