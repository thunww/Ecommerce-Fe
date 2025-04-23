import React from "react";
import { useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa6";
import { MdDeliveryDining } from "react-icons/md";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { FaBars } from "react-icons/fa";
import CategoryPanel from "./CategoryPanel";
import "../Navigation/style.css";

const Navigation = () => {
  const [isOpenCatPanel, setIsOpenCatPanel] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  const openCategoryPanel = () => {
    setIsOpenCatPanel(true);
  };

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="relative border-b border-gray-200">
        <div className="container px-4 sm:px-6 hidden md:flex items-center justify-between">
          <div className="col1 w-full md:w-1/5 lg:w-1/5">
            <Button
              className="!text-black gap-2 w-full !py-3 !text-xs sm:!text-sm"
              onClick={openCategoryPanel}
            >
              <HiOutlineMenuAlt1 className="text-[16px] flex-shrink-0" />
              <span className="truncate">Shop by Categories</span>
              <FaAngleDown className="text-[12px] ml-auto flex-shrink-0" />
            </Button>
          </div>
          <div className="col2 w-full md:w-3/5 lg:w-3/5 ">
            <ul className="flex items-center gap-2 md:gap-3 lg:gap-5 nav whitespace-nowrap">
              <li className="list-none">
                <Link
                  to="/"
                  className="link transition text-[13px] md:text-[14px] lg:text-[15px] font-[500]"
                >
                  <Button className="link transition !font-[500] !text-black hover:!text-[red] !py-3 !px-2 md:!px-3 !min-w-0 !text-xs sm:!text-sm">
                    Home
                  </Button>
                </Link>
              </li>
              <li className="list-none relative">
                <Link
                  to="/"
                  className="link transition text-[13px] md:text-[14px] lg:text-[15px] font-[500]"
                >
                  <Button className="link transition !font-[500] !text-black hover:!text-[red] !py-3 !px-2 md:!px-3 !min-w-0 !text-xs sm:!text-sm">
                    Fashion
                  </Button>
                </Link>

                <div className="submenu absolute top-[120%] left-[0%] min-w-[200px] bg-white shadow-md opacity-0 transition-all z-10">
                  <ul>
                    <li className="list-none w-full">
                      <Link to="/" className="w-full">
                        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none !text-xs sm:!text-sm">
                          Men
                        </Button>
                      </Link>
                    </li>
                    <li className="list-none w-full">
                      <Link to="/" className="w-full">
                        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none !text-xs sm:!text-sm">
                          Women
                        </Button>
                      </Link>
                    </li>
                    <li className="list-none w-full">
                      <Link to="/" className="w-full">
                        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none !text-xs sm:!text-sm">
                          Kids
                        </Button>
                      </Link>
                    </li>
                    <li className="list-none w-full">
                      <Link to="/" className="w-full">
                        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none !text-xs sm:!text-sm">
                          Boys
                        </Button>
                      </Link>
                    </li>
                    <li className="list-none w-full">
                      <Link to="/" className="w-full">
                        <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none !text-xs sm:!text-sm">
                          Girls
                        </Button>
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              <li className="list-none">
                <Link
                  to="/"
                  className="link transition text-[13px] md:text-[14px] lg:text-[15px] font-[500]"
                >
                  <Button className="link transition !font-[500] !text-black hover:!text-[red] !py-3 !px-2 md:!px-3 !min-w-0 !text-xs sm:!text-sm">
                    Electronics
                  </Button>
                </Link>
              </li>
              <li className="list-none">
                <Link
                  to="/"
                  className="link transition text-[13px] md:text-[14px] lg:text-[15px] font-[500]"
                >
                  <Button className="link transition !font-[500] !text-black hover:!text-[red] !py-3 !px-2 md:!px-3 !min-w-0 !text-xs sm:!text-sm">
                    Bags
                  </Button>
                </Link>
              </li>
              <li className="list-none">
                <Link
                  to="/"
                  className="link transition text-[13px] md:text-[14px] lg:text-[15px] font-[500]"
                >
                  <Button className="link transition !font-[500] !text-black hover:!text-[red] !py-3 !px-2 md:!px-3 !min-w-0 !text-xs sm:!text-sm">
                    Footwear
                  </Button>
                </Link>
              </li>
              <li className="list-none">
                <Link
                  to="/"
                  className="link transition text-[13px] md:text-[14px] lg:text-[15px] font-[500]"
                >
                  <Button className="link transition !font-[500] !text-black hover:!text-[red] !py-3 !px-2 md:!px-3 !min-w-0 !text-xs sm:!text-sm">
                    Groceries
                  </Button>
                </Link>
              </li>
              <li className="list-none">
                <Link
                  to="/"
                  className="link transition text-[13px] md:text-[14px] lg:text-[15px] font-[500]"
                >
                  <Button className="link transition !font-[500] !text-black hover:!text-[red] !py-3 !px-2 md:!px-3 !min-w-0 !text-xs sm:!text-sm">
                    Beauty
                  </Button>
                </Link>
              </li>
              <li className="list-none">
                <Link
                  to="/"
                  className="link transition text-[13px] md:text-[14px] lg:text-[15px] font-[500]"
                >
                  <Button className="link transition !font-[500] !text-black hover:!text-[red] !py-3 !px-2 md:!px-3 !min-w-0 !text-xs sm:!text-sm">
                    Wellness
                  </Button>
                </Link>
              </li>
            </ul>
          </div>
          <div className="col3 w-full md:w-1/5 lg:w-1/5 hidden lg:block">
            <p className="text-[12px] md:text-[13px] lg:text-[14px] font-[500] flex items-center gap-2 mb-0 mt-0 justify-end">
              <MdDeliveryDining className="text-[16px] flex-shrink-0" />
              <span className="truncate">FREE DELIVERY</span>
            </p>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className="md:hidden container px-4 py-2 flex items-center justify-between"
          ref={mobileMenuRef}
        >
          <Button
            className="!text-black !min-w-0 !p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <FaBars className="text-lg" />
          </Button>

          <Button
            className="!text-black !min-w-0 !p-2 flex items-center gap-1"
            onClick={openCategoryPanel}
          >
            <HiOutlineMenuAlt1 className="text-lg" />
            <span className="text-xs">Categories</span>
          </Button>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-white shadow-md z-50 max-h-[70vh] overflow-auto">
              <ul className="py-2">
                <li className="border-b border-gray-100">
                  <Link
                    to="/"
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    Home
                  </Link>
                </li>
                <li className="border-b border-gray-100">
                  <Link
                    to="/"
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    Fashion
                  </Link>
                </li>
                <li className="border-b border-gray-100">
                  <Link
                    to="/"
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    Electronics
                  </Link>
                </li>
                <li className="border-b border-gray-100">
                  <Link
                    to="/"
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    Bags
                  </Link>
                </li>
                <li className="border-b border-gray-100">
                  <Link
                    to="/"
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    Footwear
                  </Link>
                </li>
                <li className="border-b border-gray-100">
                  <Link
                    to="/"
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    Groceries
                  </Link>
                </li>
                <li className="border-b border-gray-100">
                  <Link
                    to="/"
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    Beauty
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    Wellness
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>

      {/* category component */}
      <CategoryPanel
        isOpenCatPanel={isOpenCatPanel}
        setIsOpenCatPanel={setIsOpenCatPanel}
      />
    </>
  );
};

export default Navigation;
