import React from "react";
import { FaUser } from "react-icons/fa";
import { MdAddBusiness, MdViewCompact , MdLogout} from "react-icons/md";
import { GiCube } from "react-icons/gi";
import logo from "../assets/logo222.png";
import { useNavigate } from "react-router";


function SideDash() {
    const navigate=useNavigate()
  return (
      <div className="bg-gray-600 min-h-full p-2">

         <div className="flex items-center justify-center p-4 min-h-full  ">
                  <img
                    className="md:w-8 md:h-8 h-4 w-4 md:me-3 me-1  cursor-pointer"
                    onClick={() => navigate("/dash")}
                    src={logo}
                    alt="Logo"
                  />
                  <h2
                    onClick={() => navigate("/dash")}
                    className="font-bold md:text-2xl text-xs  text-gray-200 cursor-pointer tracking-widest"
                  >
                    PLASHOE
                  </h2>
                </div>
        <div  onClick={()=>navigate('/dash')} className="flex text-white me-0.5 md:p-6 py-5 items-center justify-center hover:bg-gray-500 hover:rounded-lg border-b border-spacing-10 border-gray-500">
          <div className="p-1.5 ms-0.5">
            <MdViewCompact size={24} />
          </div>
          <div>
            <h2  className="text-lg hidden md:flex font-medium pt-0.5">
              Overview
            </h2>
          </div>
        </div>

        <div onClick={()=>navigate('/userDetails')} className="flex md:p-6 py-5 me-1 items-center justify-center text-white hover:bg-gray-500 hover:rounded-lg border-b border-spacing-10 border-gray-500">
          <div className="p-1.5 ms-1.5">
            <FaUser />
          </div>
          <div>
            <h2 className="text-lg hidden md:flex font-medium ms-1">Users</h2>
          </div>
        </div>
        <div  onClick={()=>navigate('/viewOrders')} className="flex md:p-6 py-5 items-center justify-center text-white hover:bg-gray-500 hover:rounded-lg border-b border-spacing-10 border-gray-500">
          <div className="p-1.5 ms-0.5">
            <GiCube size={24} />
          </div>
          <div>
            <h2 className="text-lg hidden md:flex font-medium pt-0.5">
              Orders
            </h2>
          </div>
        </div>
        <div onClick={()=>navigate('/editProducts')} className="flex md:p-6 py-5 items-center justify-center text-white hover:bg-gray-500 hover:rounded-lg border-b border-spacing-10 border-gray-500">
          <div className="p-1.5 ms-0.5">
            <MdAddBusiness size={24} />
          </div>
          <div>
            <h2 className="text-lg hidden md:flex font-medium pt-0.5">
              Products
            </h2>
          </div>
        </div>
        <div onClick={() => {
                    localStorage.removeItem("id");
                    localStorage.clear()
                    navigate("/");
                    window.location.reload();
                  }} className="flex text-white md:p-6 py-5 items-center justify-center hover:bg-gray-500 hover:rounded-lg border-b border-spacing-10 border-gray-500">
          <div className="p-1.5 ms-0.5">
          <MdLogout size={24} />
          </div>
          <div>
            <h2 className="text-lg hidden md:flex font-medium pt-0.5">
              LogOut
            </h2>
          </div>
        </div>
      </div>
  );
}

export default SideDash;
