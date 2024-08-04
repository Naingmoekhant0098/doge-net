import React, { useEffect, useRef, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { CgUserList } from "react-icons/cg";
import { FaPlus } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import Switch from "react-switch";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import axios from "axios";
import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import { updateUser } from "../Slice/userSlice";
import { Link } from "react-router-dom";

const EditProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadPercentage, setDownloadPercentage] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(
        `https://doge-net.onrender.com/user/getUser?username=${currentUser?.username}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        setUser(res.data.user);
      }
    };
    fetchUser();
  }, [currentUser]);
  const handlerFile = (e) => {
    if (e.target.files[0]) {
      const temp_img = URL.createObjectURL(e.target.files[0]);
      setDownloadUrl(temp_img);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "_" + e.target.files[0];
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setDownloadPercentage(percent.toFixed(0));

          if (percent.toFixed(0) >= 100) {
            setIsComplete(true);
          } else {
            setIsComplete(false);
          }
        },
        (error) => {
          setUploadError(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setDownloadUrl(downloadUrl);
            setFormData({ ...formData, profile: downloadUrl });
          });
        }
      );
    }
  };
  const fileRef = useRef();

  const saveInfo = async () => {
    try {
      const ress = await axios.put(
        `https://doge-net.onrender.com/user/updateProfile`,
        { ...formData, _id: currentUser?._id },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (ress.status === 200) {
        toast(
          "Updated",
          {
            position: "bottom-center",
          },
          {
            style: {
              text: "10px",
            },
          }
        );

        dispatch(
          updateUser({
            username: ress?.data?.user?.username,
            bio: ress?.data?.user?.bio,
            profile: ress?.data?.user?.profile,
          })
        );
      }
    } catch (error) {}
  };

  return (
    <div className="w-full flex flex-col items-center justify-center mt-20  px-4 md:px-0  ">
      <div className=" bg-[#1e1f22] p-4 w-full md:w-[400px] rounded-lg border border-white border-opacity-15  ">
        <div className=" flex items-center justify-between">
          <h2 className=" text-[16px] opacity-60 flex items-center gap-2">
            <FiEdit />
            <div>Edit Profile</div>
          </h2>

          <Link
            to={`/@${currentUser?.username}`}
            className="  text-[20px] opacity-60 cursor-pointer"
          >
            <RxCross2 />
          </Link>
        </div>
        <div className=" mt-4">
          <div className="w-20  relative mx-auto  flex items-center justify-center">
            <img
              src={downloadUrl || user?.profile}
              className={`p-[5px]   rounded-full w-20 h-20  object-cover z-auto  
                ${
                  downloadPercentage > 0 && downloadPercentage < 100
                    ? " blur-[1px]"
                    : "blur-none"
                } `}
              alt=""
            />

            <CircularProgressbar
              value={downloadPercentage}
              className={`absolute top-0
                ${downloadPercentage >= 100 && "hidden"}
                   `}
              strokeWidth={3}
              styles={buildStyles({
                // Rotation of path and trail, in number of turns (0-1)
                rotation: 0.25,

                // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                strokeLinecap: "butt",

                pathTransitionDuration: 0.5,

                // Colors
                pathColor: `rgba(62, 152, 199, ${downloadPercentage / 100})`,

                trailColor: "#1e1f22",
                backgroundColor: "#3e98c7",
              })}
            />

            <FaPlus
              className=" absolute bottom-1 right-1 bg-white text-black text-2xl border-2  cursor-pointer transition-all duration-300 hover:text-opacity-70 rounded-full border-[#1e1f22] p-1"
              onClick={() => fileRef.current.click()}
            />
            <input
              type="file"
              onChange={handlerFile}
              className=" hidden"
              ref={fileRef}
            />
          </div>

          <div className=" mt-2">
            <div className=" text-sm opacity-80">Name</div>
            <input
              type="text"
              required
              defaultValue={currentUser?.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className=" bg-[#1e1f22] mt-2  px-2 py-3 text-[14px] outline-none   outline-[1px] rounded-lg w-full"
              placeholder=" Enter your name here !"
            />
          </div>
          <div className=" mt-3">
            <div>
              <div className=" text-sm opacity-80">Bio</div>
              <textarea
                type="email"
                defaultValue={user?.bio}
                required
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className=" bg-[#1e1f22] mt-2  px-2 py-3 text-[14px] outline-none   outline-[1px] rounded-lg w-full"
                placeholder="Write bio here !"
              />
            </div>
          </div>
          <div className="mt-3"></div>

          <div
            onClick={saveInfo}
            className="flex-1 text-[14px] text-center mt-4 border p-3 font-medium tracking-wide bg-white   cursor-pointer rounded-lg  transition-all duration-300 text-black hover:text-opacity-70"
          >
            Submit
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
