import React, { useEffect } from "react";
import Dogg from "./Dogg";
import { useSelector } from "react-redux";
import axios from "axios";

const Doggs = ({ posts, setPosts, socket }) => {
  const { currentUser } = useSelector((state) => state.user);
  const likePost = async (postId) => {
    
    try {
      const resLike = await axios.put(
        "http://localhost:3000/post/likePost",
        { postId, userId: currentUser?._id },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      
      if (resLike.status === 200) {
        
        setPosts(
          posts?.map((pt) =>
            pt._id === resLike.data.post._id
              ? {
                  ...pt,
                  likes: resLike.data.post.likes,
                }
              : pt
          )
        );

        if (resLike?.data?.post?.likes?.includes(currentUser?._id)) {
          socket.current.emit("sendNotification", {
            senderId: currentUser?._id,
            receiverId: resLike?.data?.post?.userId,
            type: "likePost",
          });
        }

        socket.current.emit("send-like", {
          ...sendLike,
          senderId: currentUser?._id,
        });
      }
    } catch (error) {}
  };

useEffect(()=>{
  socket.current.on(
    "receiveLike",
    (like) => {
      if (like && posts) {
        setPosts(
          posts?.map((pt) =>
            pt?._id === like?._id
              ? {
                  ...pt,
                  likes: like?.likes,
                }
              : pt
          )
        );
        setSinglePost({ ...singlePost, likes: like.likes });
      }
    },
    []
  );

},[])

  return (
    <div className=" flex flex-col gap-6 pb-20 pt-4">
      {posts?.length > 0 ? (
        posts?.map((post, i) => {
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
        })
      ) : (
        <h4 className=" text-center text-white text-opacity-70">
          Results not found !
        </h4>
      )}
    </div>
  );
};

export default Doggs;
