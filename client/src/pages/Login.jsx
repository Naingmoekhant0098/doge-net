import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signInSuccess } from "../Slice/userSlice";

const Login = () => {
  const [formData, setFormData] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Error , Please fill all required fields !");
    }

    try {
      const rest = await axios.post(
        "http://localhost:3000/auth/sign-in",
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (rest.status === 200) {
        dispatch(signInSuccess(rest.data.user));
        navigate("/");
      }
    } catch (error) {
      if (error.response.status === 404) {
        toast.error("Sorry , User with this email not found !");
      }
      if (error.response.status === 403) {
        toast.error("Sorry , Password do not match !");
      }
    }
  };
  return (
    <div className=" max-w-sm mx-auto  h-screen  justify-center flex flex-col  px-3  ">
      <img className=" w-24 mx-auto" src="/doge.png" alt="" />
      <form action="" onSubmit={submitHandler}>
        <div className=" mt-6">
          <div className=" text-xl uppercase    tracking-wide font-bold">
            welcome back
          </div>
          <div className=" text-[16px] mt-2 font-normal opacity-75">
            Login with your data that you entered during registration.
          </div>

          <div>
            <input
              type="email"
              required
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className=" mt-6 bg-[#1e1f22]    p-4 text-[14px]  focus:outline outline-slate-500 rounded-lg w-full"
              placeholder=" Enter your email here !"
            />
          </div>
          <div>
            <input
              type="password"
              required
              className=" mt-4 bg-[#1e1f22] border-none   text-[14px] p-4 focus:outline outline-slate-500 rounded-lg w-full"
              placeholder=" Enter your password here !"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <div className=" text-right mt-3 text-sm opacity-65 underline cursor-pointer">
              Forget Password
            </div>
          </div>
          <button
            type="submit"
            disabled={!formData?.email || !formData?.password ? true : false}
            className={` mt-6 w-full  bg-slate-100 text-black p-4  rounded-xl text-base font-semibold ${
              !formData?.email || !formData?.password
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer"
            }`}
          >
            Log In
          </button>
          <div className=" mt-6 text-center ">
            <span className="opacity-60 text-[14px]">
              {" "}
              Don't have an account ?{" "}
            </span>{" "}
            <Link to={"/sign-up"}>
              <span className=" hover:underline cursor-pointer font-semibold">
                {" "}
                Sign Up
              </span>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
