import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const categories = [
  { name: "Electronics", path: "/category/electronics" },
  { name: "Clothing", path: "/category/clothing" },
  { name: "Home & Kitchen", path: "/category/home-kitchen" },
  { name: "Beauty", path: "/category/beauty" },
  { name: "Sports", path: "/category/sports" },
];

const DesktopNav = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <div className="hidden md:flex justify-center mt-4">
      <nav className="flex space-x-8">
        {categories.map((category) => (
          <div
            key={category.name}
            className="relative"
            onMouseEnter={() => setActiveCategory(category.name)}
            onMouseLeave={() => setActiveCategory(null)}
          >
            <Link to={category.path} className="text-gray-600 hover:text-blue-600 font-medium flex items-center">
              {category.name}
              <ChevronDown size={16} className="ml-1" />
            </Link>

            {activeCategory === category.name && (
              <div className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-md mt-1 py-2 z-10">
                <Link to={`${category.path}/popular`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                  Popular in {category.name}
                </Link>
                <Link to={`${category.path}/new`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                  New Arrivals
                </Link>
                <Link to={`${category.path}/sale`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                  On Sale
                </Link>
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default DesktopNav;
