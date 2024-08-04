import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../Slice/userSlice";
const SignUp = () => {
  const [formData, setFormData] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const submitHandler = async (e) => {
    e.preventDefault();
    if (
    
      !formData.name ||
      !formData.email||
      !formData.password ||
      !formData.confirm_password 
    ) {
      toast.error("Error , Please fill all required fields !");
    } else if (formData.password !== formData.confirm_password) {
      toast.error("Error , Your password do not match!");
    } else {
      try {
        const rest = await axios.post(
          "http://localhost:3000/auth/sign-up",
          formData,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        if (rest.status == 409) {
          toast.error("Sorry , User with this email already exist !");
        }
        if (rest.status !== 200) {
          toast.error("Sorry , Fail to sign up please try again !");
        }
        if (rest.status === 200) {
          dispatch(signInSuccess(rest.data.user));
          navigate("/");
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  };
  return (
    <div className=" max-w-sm mx-auto h-screen justify-center flex flex-col  px-3  ">
      <img className=" w-24 mx-auto" src="/doge.png" alt="" />
      <form action="" onSubmit={submitHandler}>
        <div className=" mt-6">
          <div className=" text-xl uppercase    tracking-wide font-bold">
            get start now
          </div>
          <div className=" text-[16px] mt-2 font-normal opacity-75">
            Enter you credentails to access your account.
          </div>
          <div>
            <input
              type="text"
              name="name"
              className=" mt-6 bg-[#1e1f22]  required  p-4 text-[14px]  focus:outline outline-slate-500 rounded-lg w-full"
              placeholder=" Enter your name here !"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div>
            <input
              type="text"
              name="email"
              className=" mt-4 bg-[#1e1f22]  required  p-4 text-[14px]  focus:outline outline-slate-500 rounded-lg w-full"
              placeholder=" Enter your email here !"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              className=" mt-4 bg-[#1e1f22] border-none required  text-[14px] p-4 focus:outline outline-slate-500 rounded-lg w-full"
              placeholder=" Enter your password here !"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <div>
            <input
              type="password"
              name="confirm_password"
              className=" mt-4 bg-[#1e1f22] border-none required  text-[14px] p-4 focus:outline outline-slate-500 rounded-lg w-full"
              placeholder=" Enter your confirmed password here !"
              onChange={(e) =>
                setFormData({ ...formData, confirm_password: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            disabled ={formData ? false : true}
            className={` mt-6 w-full  bg-slate-100 text-black p-4  rounded-xl text-base font-semibold ${!formData?.name||!formData?.email||!formData?.password|| !formData?.confirm_password ? 'cursor-not-allowed opacity-50'  : 'cursor-pointer'}`}
          >
            Sign Up
          </button>
          <div className=" mt-6 text-center ">
            <span className="opacity-60 text-[14px]">
              {" "}
              Already have an account ?{" "}
            </span>{" "}
            <Link to={"/log-in"}>
              <span className=" hover:underline cursor-pointer font-semibold">
                Log In
              </span>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
