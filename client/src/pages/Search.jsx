import axios from "axios";
import { TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import User from "../components/User";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Search = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState(null);
  const [searchQuery,setSearchQuery] = useState('')
  const navigate  = useNavigate()
  useEffect(() => {
    try {
      const fetchPost = async () => {
        const ress = await axios.get("http://localhost:3000/user/getAllUser", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });

        if (ress.status === 200) {
          setUsers(ress.data);
        }
      };
      fetchPost();
    } catch (error) {}
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    navigate(`/searchResults?q=${searchQuery}`)
  };

  return (
    <div>
      <h1 className=" text-2xl  px-2 font-medium">Search</h1>
      <div className=" relative px-2">
        <form onSubmit={submitHandler}>
          <input
            className=" mt-4 w-full   p-2  rounded-xl px-3 pl-10  bg-gray-600 bg-opacity-85  text-white focus:outline-none "
            placeholder=" Search"
            value={searchQuery}
            onChange={(e)=>setSearchQuery(e.target.value)}
          />
        </form>
        <IoSearch className=" absolute top-6 mt-[3px] left-5  text-xl" />
      </div>
      <div className=" mt-6 flex flex-col">
        {users?.length > 0 &&
          users?.map((user,i) => {
            return (
              user?._id !== currentUser?._id && (
                <User key={i} user={user} users={users} setUsers={setUsers} />
              )
            );
          })}
      </div>
    </div>
  );
};

export default Search;
