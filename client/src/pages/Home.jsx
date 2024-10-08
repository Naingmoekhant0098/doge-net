import React, { useEffect } from "react";
import Dogg from "../components/Dogg";
import { useSelector } from "react-redux";
import Cookie from "js-cookie";

const Home = ({
  likePost,
  posts,

  socket,
}) => {
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser) {
      Cookie.set("access_token", currentUser?.token);
    }
  }, [currentUser]);

  return (
    <div className=" flex flex-col gap-4 pb-20 pt-4 px-1 ">
      {posts?.map((post, i) => {
        return (
          <Dogg
            socket={socket}
            post={post}
            key={i}
            likePost={likePost}
             
          />
        );
      })}
    </div>
  );
};

export default Home;
