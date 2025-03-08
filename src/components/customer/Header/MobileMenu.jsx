import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import AuthButtons from "./AuthButtons";
import CartIcon from "./CartIcon";
import WishlistIcon from "./WishlistIcon";
import Notifications from "./Notifications";

const categories = [
  { name: "Electronics", path: "/category/electronics" },
  { name: "Clothing", path: "/category/clothing" },
  { name: "Home & Kitchen", path: "/category/home-kitchen" },
  { name: "Beauty", path: "/category/beauty" },
  { name: "Sports", path: "/category/sports" },
];

const MobileMenu = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed top-16 left-0 w-full h-screen bg-white z-40 pt-4 px-4 overflow-y-auto">
      <div className="mb-6">
        <SearchBar />
      </div>

      <div className="border-b pb-4 mb-4">
        <div className="flex justify-between items-center">
          <Notifications count={3} />
          <WishlistIcon count={5} />
          <CartIcon itemCount={2} />
        </div>
      </div>

      <div className="space-y-1 mb-6">
        {categories.map((category) => (
          <Link key={category.name} to={category.path} className="block py-3 px-2 text-gray-800 hover:bg-blue-50 rounded-md">
            {category.name}
          </Link>
        ))}
      </div>

      <div className="pt-4 border-t">
        <AuthButtons isMobile={true} />
      </div>
    </div>
  );
};

export default MobileMenu;
