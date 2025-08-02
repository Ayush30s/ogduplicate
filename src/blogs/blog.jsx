import { Outlet } from "react-router-dom";
import Header from "../common/header";
import { useSelector } from "react-redux";

const Blogs = () => {
  const data = useSelector((state) => state.login);

  return (
    <>
      <Header userData={data?.user} />
      <Outlet />
    </>
  );
};

export default Blogs;
