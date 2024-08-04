import React from "react";
import Dogg from "./Dogg";

const Reposts = ({ posts, socket, likePost, setPosts, userId }) => {
  return (
    <div className=" flex flex-col gap-6 pb-20 pt-4">
      {posts?.map((post, i) => {
        return (
          post?.userId === userId &&
          post?.isRepost === true && (
            <Dogg
              socket={socket}
              post={post}
              key={i}
              likePost={likePost}
              setPosts={setPosts}
              posts={posts}
            />
          )
        );
      })}
    </div>
  );
};

export default Reposts;
