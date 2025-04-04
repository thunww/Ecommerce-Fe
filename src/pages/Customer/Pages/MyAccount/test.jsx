import { useSelector } from "react-redux";

const UserInfo = () => {
  const user = useSelector((state) => state.auth.user);
  return <div>Xin chào, {user?.name || "khách"}!</div>;
};

export default UserInfo;
