import axios from "axios";
import { Avatar } from "flowbite-react";
import React, { useEffect, useState } from "react";
import ReactTimeAgo from "react-time-ago";

const Noti = ({ data }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      const ress = await axios.get(
        `http://localhost:3000/user/getUser?userId=${data?.senderId}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (ress.status === 200) {
        setUser(ress.data.user);
      }
    };
    fetchUser();
  }, [data]);

  return (
    <div>
      <div className="px-2 py-4 flex  items-center gap-3 border-b border-opacity-20 border-white cursor-pointer transition-all duration-300 hover:bg-slate-800">
        <Avatar rounded img={user?.profile} />

        <div>
          <span>{user?.username}</span>{" "}
          <span className=" text-white text-opacity-70">
            {data?.type === "likePost"
              ? " liked  your post."
              : data?.type === "likeComment"
              ? " liked your comment."
              : data?.type === "commented"
              ? "commented on your post."
              : data?.type === "replied"
              ? "replied to your comment."
              : "started following you."}

 <ReactTimeAgo date={data?.createdAt} locale="en-US" timeStyle={'twitter'} className=" pl-1 text-white text-opacity-60 text-sm"/>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Noti;
