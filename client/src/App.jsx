import React, { useEffect, useRef, useState } from "react";
import Nav from "./components/Nav";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Doge from "./pages/Doge";
import Hearts from "./pages/Hearts";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import PreventRoute from "./components/PreventRoute";
import toast, { Toaster } from "react-hot-toast";
import EditProfile from "./pages/EditProfile";
import { io } from "socket.io-client";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import PostPage from "./pages/PostPage";
import ScrollToTop from "./pages/ScrollToTop";
import PreventUser from "./components/PreventUser";
import SearchResults from "./pages/SearchResults";
import { updateNoti } from "./Slice/userSlice";
import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";
import { updateNotiStatus } from "./Slice/userSlice";
import Repost from "./pages/Repost";
const App = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPosts] = useState(null);
  const [singlePost, setSinglePost] = useState(null);
  const [sendPost, setSendPost] = useState(null);
  const [sendLike, setSendLike] = useState(null);
  const dispatch = useDispatch();
  const [comments, setComments] = useState(null);

  const [notiShow, setnotiShow] = useState(false);
  const socket = useRef();
  useEffect(() => {
    try {
      const fetchPost = async () => {
        const ress = await axios.get(
          "https://doge-net.onrender.com/post/getPosts",
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        if (ress.status === 200) {
          setPosts(ress.data.posts);
        }
      };
      fetchPost();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  useEffect(() => {
    TimeAgo.addDefaultLocale(en);
    TimeAgo.addLocale(ru);
  }, [TimeAgo]);

  const location = useLocation();
  socket.current = io("https://doge-net.onrender.com");
  useEffect(() => {
    socket.current.emit("new-user-add", currentUser?._id);
  }, [currentUser]);

  useEffect(() => {
    socket.current.emit("new-post", sendPost);
  }, [sendPost]);

  socket.current.on("receiveLike", (like) => {
    console.log(like)
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
      //setSinglePost({ ...singlePost, likes: like.likes });
    }
  });

  // useEffect(() => {

  // }, [sendLike]);

  // const dispatch = useDispatch();

  useEffect(() => {
    socket.current.on("new-post-receive", (data) => {
      if (data) {
        setPosts((prev) => [data, ...prev]);
      }
    });
  }, []);
  socket.current.on("receiveNotification", (data) => {
    if (data.receiverId !== currentUser?._id) {
      dispatch(updateNotiStatus(true));
    }
  });

  const likePost = async (postId) => {
    try {
      const resLike = await axios.put(
        "https://doge-net.onrender.com/post/likePost",
        { postId, userId: currentUser?._id },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (resLike.status === 200) {
        socket.current.emit("send-like", {
          ...resLike.data.post,
          senderId: currentUser?._id,
        });
        // setPosts(
        //   posts.map((pt) =>
        //     pt._id === resLike.data.post._id
        //       ? {
        //           ...pt,
        //           likes: resLike.data.post.likes,
        //         }
        //       : pt
        //   )
        // );

        if (
          resLike?.data?.post?.likes?.includes(currentUser?._id) &&
          currentUser?._id !== resLike?.data?.post?.userId
        ) {
          const resNofi = await axios.put(
            "https://doge-net.onrender.com/user/updateNotification",
            {
              senderId: currentUser?._id,
              receiverId: resLike?.data?.post?.userId,
              type: "likePost",
              postId: postId,
            },
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );

          if (resNofi.status === 200) {
            socket.current.emit("sendNotification", resNofi.data);
          }
        }

        // setSendLike();
      }
      // if (postId === singlePost._id) {
      //   setSinglePost({ ...singlePost, likes: resLike.data.post.likes });
      // }
    } catch (error) {}
  };

  useEffect(() => {
    try {
      socket.current.on("new-comment-receive", (data) => {
        if (data) {
          setPosts(
            posts?.map((pt) =>
              pt?._id === data?.postId
                ? {
                    ...pt,
                    NoOfComments: pt.NoOfComments + 1,
                  }
                : pt
            )
          );
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  }, []);
  useEffect(() => {
    try {
      socket.current.on("new-reply-receive", (data) => {
        if (data) {
          setPosts(
            posts?.map((pt) =>
              pt?._id === data?.postId
                ? {
                    ...pt,
                    NoOfComments: pt.NoOfComments + 1,
                  }
                : pt
            )
          );
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  }, []);
  return (
    <div className=" max-w-6xl mx-auto">
      {location.pathname !== "/log-in" && location.pathname !== "/sign-up" && (
        <Nav setNotishow={setnotiShow} notiShow={notiShow} />
      )}
      <div className=" max-w-2xl mx-auto px-3">
        <ScrollToTop />
        <Routes>
          <Route element={<PreventUser />}>
            <Route
              path="/"
              element={
                <Home
                  posts={posts}
                  likePost={likePost}
                  socket={socket}
                  setPosts={setPosts}
                />
              }
            />
            <Route path="/search" element={<Search />} />
            <Route
              path="/searchResults"
              element={<SearchResults socket={socket} />}
            />
            <Route element={<PreventRoute />}>
              <Route
                path="/doge"
                element={
                  <Doge
                    posts={posts}
                    setSendPost={setSendPost}
                    setPosts={setPosts}
                    setSendLike={setSendLike}
                    comments={comments}
                  />
                }
              />
              <Route
                path="/notifications"
                element={
                  <Hearts
                    setNotishow={setnotiShow}
                    notiShow={notiShow}
                    socket={socket}
                  />
                }
              />
              <Route path="/editProfile" element={<EditProfile />} />
            </Route>
            <Route
              path="/post/:id"
              element={
                <PostPage
                  socket={socket}
                  likePost={likePost}
                  post={singlePost}
                  setSinglePost={setSinglePost}
                  posts={posts}
                  setPosts={setPosts}
                />
              }
            />
            <Route
              path="/:name"
              element={
                <Profile
                  likePost={likePost}
                  socket={socket}
                  posts={posts}
                  setPosts={setPosts}
                />
              }
            />
          </Route>
          <Route
            path="/repost"
            element={<Repost setSendPost={setSendPost} />}
          />
          <Route path="/log-in" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
        <Toaster />
      </div>
    </div>
  );
};

export default App;
