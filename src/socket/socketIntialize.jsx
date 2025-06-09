// src/socket/SocketInitializer.jsx
import { useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SocketContext } from "./socketContext";
import {
  fetchAllRequestThunk,
  changeRequestStatusThunk,
} from "../store/thunk/requestActionThunk";

const SocketInitializer = () => {
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const userdata = useSelector((state) => state?.login);
  const userType = userdata?.user?.userType;
  const userId = userdata?.user?.userId;

  useEffect(() => {
    socket.on("join", (data) => {
      setTimeout(() => {
        dispatch(fetchAllRequestThunk("all"));
      }, 1000);
    });

    socket.on("ownerAccepted", (data) => {
      setTimeout(() => {
        dispatch(fetchAllRequestThunk());
        dispatch(changeRequestStatusThunk(data));
      }, 5000);
    });

    socket.on("ownerRejected", (data) => {
      console.log("ownerRejected");
      setTimeout(() => {
        dispatch(fetchAllRequestThunk());
        dispatch(changeRequestStatusThunk(data));
      }, 5000);
    });
  }, [dispatch, socket]);

  useEffect(() => {
    if (!userId || !userType) return;

    const registerSocket = () => {
      socket.emit("register", { reqby: userId, reqbyType: userType });
    };

    if (socket.connected) {
      registerSocket();
    }

    socket.on("connect", registerSocket);

    return () => {
      socket.off("connect", registerSocket);
    };
  }, [socket, userType, userId]);

  return null;
};

export default SocketInitializer;
