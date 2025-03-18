import React from 'react'
import { Link } from 'react-router-dom';
import { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { FaRegSquarePlus } from "react-icons/fa6";
import { FiMinusSquare } from "react-icons/fi";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";

const CategoryCollapse = () => {
    const [submenuIndex, setSubmenuIndex] = useState(null);
    const [innerSubmenuIndex, setInnerSubmenuIndex] = useState(null);

    const toggleDrawer = (newOpen) => () => {
        props.setIsOpenCatPanel(newOpen);
    };

    const openSubmenu = (index) => {
        setSubmenuIndex(submenuIndex === index ? null : index);
    };

    const openInnerSubmenu = (index) => {
        setInnerSubmenuIndex(innerSubmenuIndex === index ? null : index);
    };
    return (
        <>

            <div className="scroll">
                <ul className="w-full">
                    {/* Danh mục 1: Fashion */}
                    <li className="list-none flex items-center relative flex-col">
                        <Link to="/" className="w-full">
                            <Button className="w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.8)]">
                                Fashion
                            </Button>
                        </Link>

                        {submenuIndex === 0 ? (
                            <FiMinusSquare
                                className="absolute top-[10px] right-[15px] cursor-pointer"
                                onClick={() => openSubmenu(0)}
                            />
                        ) : (
                            <FaRegSquarePlus
                                className="absolute top-[10px] right-[15px] cursor-pointer"
                                onClick={() => openSubmenu(0)}
                            />
                        )}

                        {/* Submenu của Fashion */}
                        {submenuIndex === 0 && (
                            <ul className="submenu w-full pl-3">
                                <li className="list-none relative">
                                    <Link to="/" className="w-full">
                                        <Button className="w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.8)]">
                                            Apparel
                                        </Button>
                                    </Link>

                                    {innerSubmenuIndex === 0 ? (
                                        <FiMinusSquare
                                            className="absolute top-[10px] right-[15px] cursor-pointer"
                                            onClick={() => openInnerSubmenu(0)}
                                        />
                                    ) : (
                                        <FaRegSquarePlus
                                            className="absolute top-[10px] right-[15px] cursor-pointer"
                                            onClick={() => openInnerSubmenu(0)}
                                        />
                                    )}

                                    {/* Submenu bên trong Apparel */}
                                    {innerSubmenuIndex === 0 && (
                                        <ul className="inner_submenu w-full pl-3">
                                            <li className="list-none relative mb-1">
                                                <Link to="/"
                                                    className=" link w-full !text-left !justify-start !px-3 transition text-[14px]">
                                                    Smart Tablet
                                                </Link>
                                            </li>
                                            <li className="list-none relative mb-1">
                                                <Link to="/" className="w-full">
                                                    <Button className="w-full !text-left !justify-start !px-3 transition text-[14px]">
                                                        Crepe T-Shirt
                                                    </Button>
                                                </Link>
                                            </li>
                                            <li className="list-none relative mb-1">
                                                <Link to="/" className="w-full">
                                                    <Button className="w-full !text-left !justify-start !px-3 transition text-[14px]">
                                                        Leather Watch
                                                    </Button>
                                                </Link>
                                            </li>
                                            <li className="list-none relative mb-1">
                                                <Link to="/" className="w-full">
                                                    <Button className="w-full !text-left !justify-start !px-3 transition text-[14px]">
                                                        Rolling Diamond
                                                    </Button>
                                                </Link>
                                            </li>
                                        </ul>
                                    )}
                                </li>
                            </ul>
                        )}
                    </li>

                    {/* Danh mục 2: Electronics */}
                    <li className="list-none flex items-center relative flex-col mt-2">
                        <Link to="/" className="w-full">
                            <Button className="w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.8)]">
                                Electronics
                            </Button>
                        </Link>

                        {submenuIndex === 1 ? (
                            <FiMinusSquare
                                className="absolute top-[10px] right-[15px] cursor-pointer"
                                onClick={() => openSubmenu(1)}
                            />
                        ) : (
                            <FaRegSquarePlus
                                className="absolute top-[10px] right-[15px] cursor-pointer"
                                onClick={() => openSubmenu(1)}
                            />
                        )}

                        {/* Submenu của Electronics */}
                        {submenuIndex === 1 && (
                            <ul className="submenu w-full pl-3">
                                <li className="list-none relative">
                                    <Link to="/" className="w-full">
                                        <Button className="w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.8)]">
                                            Phones
                                        </Button>
                                    </Link>
                                </li>
                                <li className="list-none relative">
                                    <Link to="/" className="w-full">
                                        <Button className="w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.8)]">
                                            Laptops
                                        </Button>
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                </ul>
            </div>
        </>
    )
};

export default CategoryCollapse
