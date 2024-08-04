import React, { useEffect } from "react";
import Dogg from "../components/Dogg";
import { useSelector } from "react-redux";
import Cookie from "js-cookie";

const Home = ({
  posts,
  likePost,
  setPosts,

  socket,
}) => {
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser) {
      Cookie.set("access_token", currentUser?.token);
    }
  }, [currentUser]);

  return (
    <div className=" flex flex-col gap-6 pb-20 pt-4 ">
      {posts?.map((post, i) => {
        return (
          <Dogg
            socket={socket}
            post={post}
            key={i}
            likePost={likePost}
            setPosts={setPosts}
            posts={posts}
          />
        );
      })}
    </div>
  );
};

export default Home;
