import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import Doggs from "../components/Doggs";
import Persons from "../components/Persons";
import axios from "axios";

const SearchResults = ({socket}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const [tab, setTab] = useState("posts");
  const [posts, setPosts] = useState(null);
  const [people, setPeople] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    setSearchQuery(query.get("q"));
  }, [location.search]);
  const goBack = () => {
    // window.history.back();
    navigate('/search')
  };

  const searchHandler = async (e) => {
    e.preventDefault();
    query.set("q", searchQuery);
    navigate(`/searchResults?q=${searchQuery}`);
  };

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const ress = await axios.get(
          `https://doge-net.onrender.com/post/searchPosts?searchQuery=${searchQuery}`,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        if (ress.status === 200) {
          setPosts(ress.data.posts);
          setPeople(ress.data.users);
        }
      };
      fetchPost();
    } catch (error) {}
  }, [location.search]);
 

  return (
    <div>
      <div className=" relative px-2">
        <form className=" flex items-center gap-3 " onSubmit={searchHandler}>
          <IoIosArrowBack
            className=" text-2xl cursor-pointer"
            onClick={goBack}
          />
          <input
            className="  flex-1   p-2  rounded-xl px-3 pl-10  bg-gray-600 bg-opacity-85  text-white focus:outline-none "
            placeholder=" Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        <IoSearch className=" absolute top-2 mt-[2px] left-14  text-xl" />
      </div>

      <div className=" flex gap-2 mt-3 ">
        <div
          className={`px-4 flex-1 text-opacity-75 text-sm text-center border py-[6px]  tracking-wide  cursor-pointer rounded-lg border-white border-opacity-35 transition-all duration-300 hover:text-opacity-100 bg-opacity-65 ${
            tab === "posts" ? "bg-white text-black" : "text-white"
          }`}
          onClick={() => setTab("posts")}
        >
          Posts
        </div>

        <div
          className={`px-4 flex-1 text-opacity-75 text-sm text-center border py-[6px]  tracking-wide  cursor-pointer rounded-lg border-white border-opacity-35 transition-all duration-300 hover:text-opacity-100 bg-opacity-65 ${
            tab === "persons" ? "bg-white text-black" : "text-white"
          }`}
          onClick={() => setTab("persons")}
        >
          Persons
        </div>
      </div>

      <div className=" mt-3">{tab === "posts" ? <Doggs posts={posts} setPosts={setPosts} socket={socket} /> : <Persons people={people} setPeople={setPeople} />}</div>
    </div>
  );
};

export default SearchResults;
