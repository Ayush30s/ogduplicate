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
    socket.on("join", () => {
      setTimeout(() => {
        dispatch(fetchAllRequestThunk("all"));
      }, 1000);
    });

    socket.on("follow", () => {
      console.log("follow")
      setTimeout(() => {
        dispatch(fetchAllRequestThunk("all"));
      }, 1000);
    });

    socket.on("accepted", () => {
      setTimeout(() => {
        dispatch(fetchAllRequestThunk("all"));
      }, 2000);
    });

    socket.on("rejected", () => {
      console.log("rejected");
      setTimeout(() => {
        dispatch(fetchAllRequestThunk("all"));
      }, 2000);
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
