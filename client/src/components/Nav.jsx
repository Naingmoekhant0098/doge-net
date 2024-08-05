import React, { useEffect, useState } from "react";
import { FaPlus, FaRegHeart, FaUserAstronaut } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { GoHome } from "react-icons/go";
import { GrHomeRounded } from "react-icons/gr";
import { IoSearch } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { updateNotiStatus } from "../Slice/userSlice";
const Nav = ({ setNotishow, notiShow }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [tab, setTab] = useState("");

  const { name } = useParams();

  const { notification } = useSelector((state) => state.user);

  useEffect(() => {
    setTab(location.pathname);
  }, [location.pathname]);
  const { currentUser } = useSelector((state) => state.user);

  const goBack = () => {
    window.history.back();
  };

  return (
    <div
      className={`sticky top-0  transition-all duration-300  flex items-center bg-black justify-center md:justify-between z-30`}
    >
      <div>
        <img src="/doge.png" className=" w-14  md:py-2 md:mt-0" />
      </div>
      <div className=" items-center gap-3  cursor-pointer flex justify-between w-full md:w-auto bottom-0 fixed  md:relative px-6 md:px-0 bg-black pb-1 z-50">
        {tab != "/" && (
          <div
            className=" md:w-20 h-16   transition-all duration-500 rounded-md hidden md:flex items-center justify-center px-4 md:px-0 md:hover:bg-[#1e1f22]"
            onClick={goBack}
          >
            <FaArrowLeft
              className={`  text-2xl  font-bold      
                 text-white opacity-50
               `}
            />
          </div>
        )}
        <Link to={"/"}>
          <div className=" md:w-20 h-16  transition-all duration-500 rounded-md flex items-center justify-center px-4 md:px-0 md:hover:bg-[#1e1f22]">
            <GrHomeRounded
              className={`  text-2xl  font-bold     ${
                tab === "/" ? "opacity-100 text-white" : "opacity-50"
              }`}
            />
          </div>
        </Link>
        <Link to={"/search"}>
          <div className=" md:w-20 h-16  transition-all duration-500 rounded-md flex items-center justify-center px-4 md:px-0 md:hover:bg-[#1e1f22]">
            <IoSearch
              className={`  text-3xl -mb-1  font-bold   ${
                tab === "/search" || tab === "/searchResults"
                  ? "opacity-100 text-white"
                  : "opacity-50"
              }`}
            />
          </div>
        </Link>
        <Link to={"/doge"} className=" hidden md:block">
          <div className=" md:w-20 h-16  transition-all duration-500 rounded-md flex  items-center justify-center px-4 md:px-0 md:hover:bg-[#1e1f22]  ">
            <FiEdit
              className={` text-2xl text-white  font-bold  ${
                tab === "/doge" ? "opacity-100 text-white" : "opacity-50"
              }`}
            />
          </div>
        </Link>
        <Link to={"/doge"} className=" block md:hidden">
          <div className=" md:w-20 h-12  transition-all duration-500 rounded-lg flex  items-center justify-center px-4  md:px-0  bg-[#141416]  ">
            <FaPlus
              className={` text-2xl text-white  font-bold  ${
                tab === "/doge" ? "opacity-100 text-white" : "opacity-50"
              }`}
            />
          </div>
        </Link>
        <Link to={"/notifications"}>
          <div
            className=" md:w-20 h-16  relative transition-all duration-500 rounded-md flex items-center justify-center px-4 md:px-0 md:hover:bg-[#1e1f22]"
            onClick={() => dispatch(updateNotiStatus(false))}
          >
            <FaRegHeart
              className={`  text-2xl  font-bold   ${
                tab === "/notifica5tions"
                  ? "opacity-100 text-white"
                  : "opacity-50"
              }`}
            />

            {notification && (
              <div className=" absolute w-2 h-2 bg-red-500 rounded-full top-3"></div>
            )}
          </div>
        </Link>
        {currentUser ? (
          <Link to={`/@${currentUser?.username}`}>
            <div className=" md:w-20 h-16  transition-all duration-500 rounded-md flex items-center justify-center px-4 md:px-0 md:hover:bg-[#1e1f22]">
              <FaUserAstronaut
                className={`  text-2xl  font-bold   ${
                  decodeURIComponent(tab) === `/@${currentUser?.username}`
                    ? "opacity-100 text-white"
                    : "opacity-50"
                }`}
              />
            </div>
          </Link>
        ) : (
          <Link to={"/log-in"}>
            <div className=" md:w-20 h-16  transition-all duration-500 rounded-md flex items-center justify-center md:hover:bg-[#1e1f22]">
              <FaUserAstronaut
                className={`  text-2xl  font-bold   ${
                  tab === "/profile" ? "opacity-100 text-white" : "opacity-50"
                }`}
              />
            </div>
          </Link>
        )}
      </div>
      <div className=" hidden md:block">
        {/* <Link to={"/log-in"}>
          <div className=" bg-white text-black p-4 py-1 text-[16px] rounded-md  font-medium">
            {" "}
            Login
          </div>
        </Link> */}
      </div>
    </div>
  );
};

export default Nav;
