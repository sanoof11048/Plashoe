
import React, { useState, useEffect } from "react";
import logo from "../assets/logo222.png";
import { RiUser3Line } from "react-icons/ri";
import { useNavigate } from "react-router";
import { useUser } from "../components/userContext";

function AdminNav() {
  const [showLogout, setShowLogout] = useState(false);

  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div>
      <nav className="flex justify-between items-center p-4 bg-transparent w-full h-20">
        <div className="flex items-center text-center justify-center md:w-auto ps-5 ">
          <img
            className="w-8 h-8 me-3 cursor-pointer"
            onClick={() => navigate("/dash")}
            src={logo}
            alt="Logo"
          />
          <h2
            onClick={() => navigate("/dash")}
            className="font-bold text-2xl  text-white cursor-pointer tracking-widest"
          >
            PLASHOE
          </h2>
        </div>

        <div className="hidden md:flex space-x-6 w-3/4 justify-center   ">
          <h1 className="font-bold text-2xl  text-white cursor-pointer ">
            Admin Panel
          </h1>
        </div>
        <div
          onMouseEnter={() => setShowLogout(true)}
          onMouseLeave={() => setShowLogout(false)}
        >
          {user && (
            <a
              // onClick={login}
              className="text-white  cursor-pointer hover:text-gray-900 hover:scale-110 transition-transform duration-300 ease-in-out"
            >
              {}
              <RiUser3Line size={24} />
            </a>
          )}
          {!user && (
            <button
              // onClick={login}
              className=" ms-2 cursor-pointer hover:text-gray-700 text-stone-500 h-6 text-sm px-4 py-3 items-center justify-center flex text-center hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              Login
            </button>
          )}
          {showLogout && user && (
            <div className="absolute right-4 top-13  bg-white z-20 shadow-md rounded ms-20 p-1">
              <ul className="">
                <li
                  className="cursor-pointer hover:text-gray-700 hover:bg-slate-300 p-1 px-5 hover:rounded-lg"
                  onClick={() => {
                    localStorage.removeItem("id");

                    navigate("/");
                    window.location.reload();
                  }}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default AdminNav;
