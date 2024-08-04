import axios from "axios";
import { Avatar } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Noti from "../components/Noti";
import { updateNotiStatus } from "../Slice/userSlice";

const Hearts = ({ setNotishow, notiShow, socket }) => {
  const {notifications} = useSelector((state)=>state.user)
  const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(updateNotiStatus(true));
  // });
  const { currentUser } = useSelector((state) => state.user);
  const [noti, setNoti] = useState(null);
  useEffect(() => {
    const fetchNoti = async () => {
      const res = await axios.get(
        `https://doge-net.onrender.com/user/getNotifications/${currentUser?._id}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        setNoti(res.data);
      }
    };
    fetchNoti();
  }, []);

  socket.current.on("receiveNotification", (data) => {
    if (data.receiverId !== currentUser?._id) {
      // setNotishow(true);

      setNoti((prev) => [...prev, data]);
    }
  });

  return (
    <div>
      <h1 className=" text-2xl  px-2 font-medium">Notifications</h1>
      <div className=" mt-6 flex flex-col">
        {noti?.length > 0 ? (
          noti?.map((n, i) => {
            return n.senderId !== currentUser?._id && <Noti data={n} key={i} />;
          })
        ) : (
          <h4 className=" text-center text-white text-opacity-70">
             No notifications yet !
          </h4>
        )}
      </div>
    </div>
  );
};

export default Hearts;
