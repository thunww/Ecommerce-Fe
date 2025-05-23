import React, { useState, useEffect } from "react";
import Sidebar from "../../../../components/customer/Components/Sidebar";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import ProductItem from "../../../../components/customer/Components/ProductItem";
import ProductItemListView from "../../../../components/customer/Components/ProductItemListView";
import Button from "@mui/material/Button";
import { IoGrid } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import { fetchAllProducts } from "../../../../redux/productSilce";
import { useDispatch, useSelector } from "react-redux";

const ProductListing = ({ products = [], loading = false, error = null }) => {
  const [itemView, setItemView] = useState("grid");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPageGrid] = useState(12);
  const [productsPerPageList] = useState(5);
  const open = Boolean(anchorEl);

  const activeProducts = products.filter(
    (product) => product.status === "active"
  );

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handlePageChange = (event, value) => setCurrentPage(value);

  const indexOfLastProduct =
    itemView === "grid"
      ? currentPage * productsPerPageGrid
      : currentPage * productsPerPageList;
  const indexOfFirstProduct =
    indexOfLastProduct -
    (itemView === "grid" ? productsPerPageGrid : productsPerPageList);
  const currentProducts = activeProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <section className="py-2 pb-0">
      <div className="bg-white p-2 mt-2">
        <div className="container flex gap-3">
          <div className="sidebarWrapper w-[20%] h-full bg-white">
            <Sidebar />
          </div>

          <div className="rightContent w-[80%] py-3">
            <div className="bg-[#f1f1f1] p-2 w-full mb-3 rounded-md flex items-center justify-between">
              <div className="col1 flex items-center gap-3 itemViewActions">
                <Button
                  className={`!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000] ${
                    itemView === "list" ? "active" : ""
                  }`}
                  onClick={() => setItemView("list")}
                >
                  <GiHamburgerMenu className="text-[rgba(0,0,0,0.7)]" />
                </Button>
                <Button
                  className={`!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000] ${
                    itemView === "grid" ? "active" : ""
                  }`}
                  onClick={() => setItemView("grid")}
                >
                  <IoGrid className="text-[rgba(0,0,0,0.7)]" />
                </Button>
                <span className="text-[14px] font-[500] pl-3 text-[rgba(0,0,0,0.7)]">
                  {`There are ${activeProducts.length} products.`}
                </span>
              </div>

              <div className="col2 ml-auto flex items-center justify-end gap-3 pr-4">
                <span className="text-[14px] font-[500] pl-3 text-[rgba(0,0,0,0.7)]">
                  Sort by
                </span>

                <Button
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  className="!bg-white !text-[12px] !text-[#000] !capitalize !border-2 !border-[#000]"
                >
                  Sales, highest to lowest
                </Button>

                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{ "aria-labelledby": "basic-button" }}
                >
                  <MenuItem
                    onClick={handleClose}
                    className=" !text-[13px] !text-[#000] !capitalize"
                  >
                    Sales, highest to lowest
                  </MenuItem>
                  <MenuItem
                    onClick={handleClose}
                    className=" !text-[13px] !text-[#000] !capitalize"
                  >
                    Relevance
                  </MenuItem>
                  <MenuItem
                    onClick={handleClose}
                    className=" !text-[13px] !text-[#000] !capitalize"
                  >
                    Name, A to Z
                  </MenuItem>
                  <MenuItem
                    onClick={handleClose}
                    className=" !text-[13px] !text-[#000] !capitalize"
                  >
                    Name, Z to A
                  </MenuItem>
                  <MenuItem
                    onClick={handleClose}
                    className=" !text-[13px] !text-[#000] !capitalize"
                  >
                    Price, low to high
                  </MenuItem>
                  <MenuItem
                    onClick={handleClose}
                    className=" !text-[13px] !text-[#000] !capitalize"
                  >
                    Price, high to low
                  </MenuItem>
                </Menu>
              </div>
            </div>

            <div
              className={`grid ${
                itemView === "grid"
                  ? "grid-cols-4 md:grid-cols-4"
                  : "grid-cols-1 md:grid-cols-1"
              } gap-4`}
            >
              {loading ? (
                <Typography variant="h6">Loading...</Typography>
              ) : error ? (
                <Typography variant="h6" color="error">
                  {error}
                </Typography>
              ) : itemView === "grid" ? (
                currentProducts.map((product) => (
                  <ProductItem key={product.id} product={product} />
                ))
              ) : (
                currentProducts.map((product) => (
                  <ProductItemListView key={product.id} product={product} />
                ))
              )}
            </div>

            <div className="flex items-center justify-center mt-10">
              <Pagination
                count={Math.ceil(
                  activeProducts.length /
                    (itemView === "grid"
                      ? productsPerPageGrid
                      : productsPerPageList)
                )}
                page={currentPage}
                onChange={handlePageChange}
                showFirstButton
                showLastButton
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListing;
