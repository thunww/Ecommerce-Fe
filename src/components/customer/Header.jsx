import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import AuthButtons from "./AuthButtons";
import CartIcon from "./CartIcon";
import WishlistIcon from "./WishlistIcon";
import Notifications from "./Notifications";
import SearchBar from "./SearchBar";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  // Categories for the menu
  const categories = [
    { name: "Electronics", path: "/category/electronics" },
    { name: "Clothing", path: "/category/clothing" },
    { name: "Home & Kitchen", path: "/category/home-kitchen" },
    { name: "Beauty", path: "/category/beauty" },
    { name: "Sports", path: "/category/sports" }
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`bg-white w-full z-50 fixed top-0 left-0 transition-all duration-300 ${
          isScrolled ? "shadow-lg py-2" : "shadow-md py-4"
        }`}
      >
        <div className="container mx-auto px-4">
          {/* Main Navigation Bar */}
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link 
              to="/" 
              className="text-2xl font-bold text-blue-600 flex items-center"
            >
              <svg 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-8 h-8 mr-2"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              MyShop
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex flex-1 mx-6 max-w-lg">
              <SearchBar />
            </div>

            {/* Desktop Icons */}
            <div className="hidden md:flex items-center space-x-6">
              <Notifications count={3} />
              <WishlistIcon count={5} />
              <CartIcon itemCount={2} />
              <AuthButtons />
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-gray-500 hover:text-blue-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>

          {/* Category Navigation */}
          <div className="hidden md:flex justify-center mt-4">
            <nav className="flex space-x-8">
              {categories.map((category) => (
                <div 
                  key={category.name} 
                  className="relative"
                  onMouseEnter={() => setActiveCategory(category.name)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <Link
                    to={category.path}
                    className="text-gray-600 hover:text-blue-600 font-medium flex items-center"
                  >
                    {category.name}
                    <ChevronDown size={16} className="ml-1" />
                  </Link>
                  
                  {/* Dropdown for subcategories */}
                  {activeCategory === category.name && (
                    <div className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-md mt-1 py-2 z-10">
                      <Link 
                        to={`${category.path}/popular`} 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                      >
                        Popular in {category.name}
                      </Link>
                      <Link 
                        to={`${category.path}/new`} 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                      >
                        New Arrivals
                      </Link>
                      <Link 
                        to={`${category.path}/sale`} 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                      >
                        On Sale
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
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
              <Link
                key={category.name}
                to={category.path}
                className="block py-3 px-2 text-gray-800 hover:bg-blue-50 rounded-md"
              >
                {category.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t">
            <AuthButtons isMobile={true} />
          </div>
        </div>
      )}

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className={`${isScrolled ? "h-24" : "h-32"} md:h-36`}></div>
    </>
  );
};

export default Header;