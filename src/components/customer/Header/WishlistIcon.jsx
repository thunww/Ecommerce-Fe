import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const WishlistIcon = ({ count }) => {
  return (
    <Link 
      to="/wishlist" 
      className="relative cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
      aria-label={`Wishlist with ${count || 0} items`}
    >
      <Heart 
        size={24} 
        className="text-gray-700 hover:text-pink-600 transition-colors duration-200" 
      />
      
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
};

export default WishlistIcon;