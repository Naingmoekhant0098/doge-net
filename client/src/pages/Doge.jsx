import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { BsImages } from "react-icons/bs";
import { FiCamera } from "react-icons/fi";
import { BsFiletypeGif } from "react-icons/bs";
import GifPicker from "gif-picker-react";
import Webcam from "react-webcam";
import { RxCross2 } from "react-icons/rx";
import { IoMdCloseCircleOutline } from "react-icons/io";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Textarea } from "flowbite-react";

const Doge = ({ posts, setPosts, setSendPost }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [content, setContent] = useState("");
  const [isOpenGift, setIsOpenGift] = useState(false);

  const [files, setFiles] = useState(null);
  const [tempFiles, setTempFiles] = useState([]);
  const [gif, setGif] = useState(null);
  const [imageUrls, setImageUrl] = useState([]);
  const fileRef = useRef();
  const navigate = useNavigate();

  const uploadHandler = (e) => {
    const filess = e.target.files;
    setFiles(Array.from(e.target.files));
    for (let i = 0; i < filess.length; i++) {
      const tmp_file = URL.createObjectURL(filess[i]);
      setTempFiles((prev) => [...prev, tmp_file]);
    }
  };

  const deleteImg = (i) => {
    setTempFiles(tempFiles.filter((tm) => tm != tempFiles[i]));
    setFiles(files.filter((ft, index) => index != i));
  };
  const testFile = [];
  const uploadImageFun = () => {
    const storage = getStorage(app);
    const testFiles = [];
    let toId = toast.loading("Posting...");
    for (let i = 0; i < files.length; i++) {
      const storageRef = ref(
        storage,
        new Date().getTime() + "_" + files[i].name
      );

      const uploadTask = uploadBytesResumable(storageRef, files[i]);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percentage =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (err) => {
          console.log(err);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            // setImageUrl((prev)=>[...prev,downloadUrl])
            testFiles.push(downloadUrl);

            if (testFiles.length >= files.length) {
              postSave(testFiles, toId);
            }
          });
        }
      );
    }
  };
  const postSave = async (testFiles, toId) => {
    try {
      const resData = await axios.post(
        "https://doge-net.onrender.com/post/createPost",
        {
          content: content,
          images: testFiles,
          gif: gif,
          userId: currentUser?._id,
        }
      );

      if (resData.status === 200) {
        // setPosts((prev)=>[resData.data.post,...prev])
        setSendPost(resData.data.post);
        toast(
          "Post uploaded",
          {
            position: "bottom-center",
          },
          {
            style: {
              text: "10px",
            },
          }
        );
        toast.dismiss(toId);
        navigate("/");
      }
    } catch (error) {}
  };
  const submitHandler = async () => {
    if (files?.length > 0) {
      uploadImageFun();
    } else {
      if (content !== "" || gif || tempFiles.length > 0) {
        try {
          const resData = await axios.post(
            "https://doge-net.onrender.com/post/createPost",
            { content: content, gif: gif, userId: currentUser?._id }
          );

          if (resData.status === 200) {
            setSendPost(resData.data.post);
            toast(
              "Post uploaded",
              {
                position: "bottom-center",
              },
              {
                style: {
                  text: "10px",
                },
              }
            );
            navigate("/");
          }
        } catch (error) {}
      }
    }
  };

  return (
    <div className="w-full flex flex-col   px-4 md:px-0  ">
      <div className=" mt-5 text-xl font-medium">Add Dogenet</div>
      <div className="  w-full flex gap-3 mt-5">
        <div className=" h-auto flex flex-col items-center">
          <div className=" w-10 h-10  relative cursor-pointer">
            <img
              src={currentUser?.profile}
              className=" rounded-full w-full h-10  object-cover z-auto"
              alt=""
            />
          </div>

          <span className=" w-2 h-full   border-l-2 mt-4  opacity-30  z-0"></span>
          <div className=" relative mt-2">
            <img
              src={currentUser?.profile}
              className="w-6 h-6  rounded-full  object-cover "
              alt=""
            />
          </div>
        </div>

        <div className=" h-auto w-full  md:w-[600px] overflow-hidden ">
          <div className="text-[14px]">{currentUser?.username}</div>

          <div className=" mt-2 px-1">
            <textarea
              type="email"
              autoFocus
              required
              value={content}
              className="bg-inherit   text-white    mb-2 text-[14px]    rounded-lg w-full focus:outline-none  focus:border-0  "
              placeholder="What's news ?"
              rows={3}
              onChange={(e) => setContent(e.target.value)}
            />
            {tempFiles.length > 0 || gif ? (
              <div className=" flex gap-2    overflow-auto scrollBar">
                {tempFiles.length > 0 &&
                  tempFiles?.map((tmp, i) => {
                    return (
                      <div key={i} className=" relative">
                        <RxCross2
                          className=" absolute top-1 text-2xl bg-slate-200 bg-opacity-70 rounded-full p-1   cursor-pointer  font-semibold transition-all duration-300 hover:opacity-80 right-2 text-black"
                          onClick={() => deleteImg(i)}
                        />
                        <img
                          src={tmp}
                          className=" cursor-pointer max-w-[200px] h-[200px] object-cover rounded-lg"
                        />
                      </div>
                    );
                  })}

                {gif && (
                  <div className=" relative">
                    <RxCross2
                      className=" absolute top-1 text-2xl bg-slate-200 bg-opacity-70 rounded-full p-1   cursor-pointer  font-semibold transition-all duration-300 hover:opacity-80 right-2 text-black"
                      onClick={() => {
                        setGif(null), setIsOpenGift(false);
                      }}
                    />
                    <img
                      src={gif}
                      className=" cursor-pointer max-w-[250px] max-h-[300px] object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className=" flex gap-6 items-center text-xl">
                <BsImages
                  onClick={() => fileRef.current.click()}
                  className=" cursor-pointer  transition-all duration-300 hover:opacity-60"
                />

                <BsFiletypeGif
                  className=" cursor-pointer  transition-all duration-300 hover:opacity-60"
                  onClick={() => setIsOpenGift(true)}
                />
                <span
                  onClick={() => setContent((prev) => prev + "#")}
                  className=" cursor-pointer  transition-all duration-300 hover:opacity-60"
                >
                  #
                </span>
                <input
                  type="file"
                  multiple
                  onChange={uploadHandler}
                  className=" hidden"
                  ref={fileRef}
                />
                <div
                  className={`  w-full h-screen bg-black bg-opacity-55 left-0 right-0 bottom-0 top-0 z-50  transition-all duration-300 fixed ${
                    isOpenGift ? "visible opacity-100" : " invisible opacity-0"
                  }`}
                >
                  <div className="   text-sm h-full w-full flex-col flex items-center justify-center ">
                    <div>
                      <div className=" flex items-center justify-end">
                        <RxCross2
                          className=" text-2xl mb-4 cursor-pointer   font-bold"
                          onClick={() => setIsOpenGift(false)}
                        />
                      </div>
                      <GifPicker
                        tenorApiKey={"AIzaSyBTEXOWGAoVhlpuQw1_oJijFF7hgCTI4Pw"}
                        theme="dark"
                        onGifClick={(e) => {
                          setGif(e.url);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className=" mt-6 flex  justify-between items-center">
              <div className=" text-sm opacity-30">Add to dogenet</div>
              <div
                className={` bg-white   text-black px-4 py-2 text-sm font-bold rounded-lg transition-all duration-300 hover:opacity-60
                    ${
                      content !== "" || gif || tempFiles.length > 0
                        ? " cursor-pointer"
                        : " cursor-not-allowed"
                    }
                  `}
                onClick={submitHandler}
              >
                Post
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doge;
