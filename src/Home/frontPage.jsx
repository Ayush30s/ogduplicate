import Header from "../common/header";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const FrontPage = () => {
  const data = useSelector((state) => state.login);

  return (
    <div>
      <div className="fixed top-0 w-full z-10">
        <Header userData={data?.user} />
      </div>
      <div className="w-full  mt-16">
        <Outlet />
      </div>
    </div>
  );
};

export default FrontPage;
