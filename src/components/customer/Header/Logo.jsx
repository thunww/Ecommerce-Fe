import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center">
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 mr-2">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
      MyShop
    </Link>
  );
};

export default Logo;
