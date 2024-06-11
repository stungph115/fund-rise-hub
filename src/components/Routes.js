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
import ProjectCheckOut from "./Project/ProjectCheckOut";
import Checkout from "./Payment/Checkout";
import PaymentSuccess from "./Payment/PaymentSuccess";
import Favorite from "./Project/Favorite";
import ProjectCreated from "./StartProject/ProjectCreated";
import Discover from "./Discover/Discover";

export default function AppRoutes({ categories }) {
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
            <Route path="/project/checkout/:projectId/" element={<ProjectCheckOut />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/start" element={<StartProject categories={categories} />} />
            <Route path="/checkout/:idProject/:idReward/:amout" element={<Checkout />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/favorite" element={<Favorite />} />
            <Route path="/start/success/:idProject" element={<ProjectCreated />} />
            <Route path="/discover/" element={< Discover categories={categories} />} />
            <Route path="*" element={<Navigate to="/not-found" />} />
        </Routes>
    )
}