import { Navigate, Route, Routes } from "react-router";
import Home from "./Home/Home";
import ResetPassword from "./Auth/ResetPassword";
import ForgetPassword from "./Auth/ForgotPassword";
import SignIn from "./Auth/SignIn";
import SignUp from "./Auth/SignUp";
import NotFound from "./ErrorPage/NotFoundPage";
import ForbiddenPage from "./ErrorPage/403Page";
import Profile from "./Profile/Profile";
import Message from "./Message/Message";
import Project from "./Project/Project";
import Payment from "./Payment/Payment";
import StartProject from "./StartProject/StartProject";

export default function AppRoutes({ }) {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/forget-password' element={<ForgetPassword />} />
            <Route path='/reset-password/:token' element={<ResetPassword />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="/403" element={<ForbiddenPage />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/message" element={<Message />} />
            <Route path="/project/:projectId" element={<Project />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/start" element={<StartProject />} />
            <Route path="*" element={<Navigate to="/not-found" />} />
        </Routes>
    )
}