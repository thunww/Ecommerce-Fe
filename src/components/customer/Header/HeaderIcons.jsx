import AuthButtons from "./AuthButtons";
import CartIcon from "./CartIcon";
import WishlistIcon from "./WishlistIcon";
import Notifications from "./Notifications";

const HeaderIcons = () => {
  return (
    <div className="hidden md:flex items-center space-x-6">
      <Notifications count={3} />
      <WishlistIcon count={5} />
      <CartIcon itemCount={2} />
      <AuthButtons />
    </div>
  );
};

export default HeaderIcons;
