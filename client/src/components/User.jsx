import axios from "axios";
import { Avatar } from "flowbite-react";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { updateFollow } from "../Slice/userSlice";

const User = ({ user, users, setUsers }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const handleFollow = async () => {
    try {
      const ress = await axios.put(
        "https://doge-net.onrender.com/post/followUser",
        { followUser: user._id, followedUser: currentUser?._id },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      
      if (ress.status === 200) {
        dispatch(updateFollow(ress.data.user));
        if (ress.data.followedUser._id === user?._id) {
          setUsers(
            users.map((userr) =>
              userr._id === user._id
                ? { ...userr, followers: ress.data.followedUser.followers }
                : userr
            )
          );
        }
      }
    } catch (error) {}
  };

  return (
    <div className=" px-2 flex w-full justify-between items-center py-4  border-b border-opacity-20 border-white cursor-pointer transition-all duration-300 hover:bg-slate-800">
      <div className=" flex gap-3  items-center">
        <div>
          <Link to={`/@${user?.username}`}>
            <Avatar img={user?.profile} rounded  className=" z-40"/>
          </Link>
        </div>

        <div>
          <Link to={`/@${user?.username}`}>
            <div className=" text-sm">{user?.username}</div>
            <div className=" text-sm text-white text-opacity-75">
              {user?.followers?.length}
              <span className=" ml-[3px]">followers</span>
            </div>
          </Link>
        </div>
      </div>

      {currentUser?.followings?.includes(user?._id) ? (
        <div
          className="px-4 text-opacity-75 text-sm text-center border py-[6px]  tracking-wide  cursor-pointer rounded-lg border-white border-opacity-35 transition-all duration-300 text-white hover:text-opacity-100 bg-opacity-65"
          onClick={() => handleFollow()}
        >
          Following
        </div>
      ) : (
        <div
          className="px-4 text-opacity-75 text-sm text-center border py-[6px]  tracking-wide  cursor-pointer rounded-lg border-white border-opacity-35 transition-all duration-300 text-white hover:text-opacity-100 bg-opacity-65"
          onClick={() => handleFollow()}
        >
          Follow
        </div>
      )}
    </div>
  );
};

export default User;
