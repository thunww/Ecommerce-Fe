import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import DesktopNav from "./DesktopNav";
import HeaderIcons from "./HeaderIcons";
import MobileMenu from "./MobileMenu";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`bg-white w-full z-50 fixed top-0 left-0 transition-all duration-300 ${isScrolled ? "shadow-lg py-2" : "shadow-md py-4"}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Logo />
          <div className="hidden md:flex flex-1 mx-6 max-w-lg">
            <SearchBar />
          </div>
          <HeaderIcons />
          <button className="md:hidden p-2 text-gray-500 hover:text-blue-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <DesktopNav />
      </header>
      <MobileMenu isOpen={isMobileMenuOpen} />
      
    </>
  );
};

export default Header;
