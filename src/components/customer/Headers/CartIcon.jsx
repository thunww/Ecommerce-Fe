import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const CartIcon = ({ itemCount }) => {
  return (
    <Link 
      to="/cart" 
      className="relative cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
      aria-label={`Shopping cart with ${itemCount || 0} items`}
    >
      <ShoppingCart 
        size={24} 
        className="text-gray-700 hover:text-gray-900 transition-colors duration-200" 
      />
      
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse-light shadow-sm">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
      
      <style jsx>{`
        @keyframes pulse-light {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-light {
          animation: pulse-light 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </Link>
  );
};

export default CartIcon;