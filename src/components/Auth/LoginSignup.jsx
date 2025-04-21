// LoginSignup.jsx - Optimized for mobile bottom animation
import React, { useState } from "react";
import "boxicons/css/boxicons.min.css";
import LoginForm from "./features/LoginForm";
import SignUpForm from "./features/SignUpForm";
import './SignUp_LogIn_Form.css';
import logo from "../../assets/logo22.png";
import { useNavigate } from "react-router";

const LoginSignup = () => {
  const [isActive, setIsActive] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate()

  return (
    <>
      <div className="z-30 float-start absolute cursor-pointer w-fit flex items-center mt-5 ml-10 ">
        <img onClick={() => navigate("/")} className="w-8 h-8" src={logo} />
        <h2
          onClick={() => navigate("/")}
          className="font-bold text-2xl font-sans"
        >
          PLASHOE
        </h2>
      </div>
    <div className="w-screen h-screen flex bg-gradient-to-r from-antiquewhite to-dusty justify-center items-center">
      <div
        className={`containerF relative w-4/5 md:w-4/5 lg:w-3/5 h-[90vh] md:h-5/6 bg-white m-2 sm:m-5 rounded-3xl shadow-lg overflow-hidden transition-all duration-700 ${isActive ? "active" : ""
          }`}
      >
        {/* Login Form */}
        <div
          className={`form-box mt-32 md:mt-0 login absolute top-0 md:top-auto right-0 w-full md:w-1/2 h-full bg-white flex flex-col justify-center items-center text-center px-4 py-6 sm:p-10 transition-all duration-700`}
        >
          {isLogin ? (
            <LoginForm setIsLogin={setIsLogin} />
          ) : null}
        </div>

        {/* Registration Form */}
        <div
          className={`form-box  register absolute top-0 md:top-auto left-0 md:left-0 w-full md:w-1/2 h-full bg-white flex flex-col justify-center items-center text-center px-4 py-6 sm:p-10 transition-all duration-700`}
        >
          {!isLogin ? (
            <SignUpForm setIsLogin={setIsLogin} setIsActive={setIsActive} />
          ) : null}
        </div>

        {/* Toggle Box */}
        <div className="toggle-box absolute w-full h-1/4">
          <div
            className={`toggle-panel toggle-left absolute w-full md:w-1/2 h-1/3 md:h-full flex flex-col justify-center items-center text-white transition-all duration-700`}
          >
            <h1 className="text-2xl sm:text-3xl text-stone-500 font-bold mb-2">Welcome Back!</h1>
            <p className="mb-3 sm:mb-5 text-stone-400 text-sm sm:text-base">Don't have an account?</p>
            <button
              onClick={() => {
                setIsActive(true);
                setTimeout(() => {
                  setIsLogin(false);
                }, 700);
              }}
              className="btn w-32 sm:w-40 h-10 sm:h-12 bg-transparent border-2 border-white hover:border-stone-500 text-stone-500 rounded-lg hover:bg-white hover:text-gray-500 transition text-sm sm:text-base"
            >
              Register
            </button>
          </div>
          <div
            className={`toggle-panel toggle-right absolute right-0 w-full md:w-1/2 h-1/6 md:h-full flex flex-col justify-center items-center text-white transition-all duration-700`}
          >
            <h1 className="text-2xl sm:text-3xl text-stone-500 font-bold mb-2">Hello, Welcome!</h1>
            <p className="mb-3 sm:mb-5 text-stone-400 text-sm sm:text-base">Already have an account?</p>
            <button
              onClick={() => {
                setIsActive(false);
                setTimeout(() => {
                  setIsLogin(true);
                }, 700);
              }}
              className="btn w-32 sm:w-40 h-10 sm:h-12 bg-transparent border-2 border-white hover:border-stone-500 text-stone-500 rounded-lg hover:bg-white hover:text-gray-500 transition text-sm sm:text-base"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default LoginSignup;