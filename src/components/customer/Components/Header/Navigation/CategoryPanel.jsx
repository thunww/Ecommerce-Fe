import React, { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CategoryCollapse from "../../CategoryCollapse";
import { FaRegSquarePlus } from "react-icons/fa6";
import { FiMinusSquare } from "react-icons/fi";
import Button from "@mui/material/Button";
import { Link } from 'react-router-dom';

const CategoryPanel = (props) => {
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

    const DrawerList = (
        <Box
            sx={{
                width: { xs: '85vw', sm: '300px', md: '320px' },
                maxWidth: '100vw',
                height: '100%',
                overflow: 'auto'
            }}
            role="presentation"
            className="categoryPanel"
        >
            <div className="sticky top-0 bg-white z-10 border-b border-gray-200 shadow-sm">
                <h3 className="p-3 sm:p-4 text-[16px] sm:text-[20px] font-[500] flex items-center justify-between">
                    <span className="truncate">Shop By Category</span>
                    <IoCloseSharp
                        onClick={toggleDrawer(false)}
                        className="cursor-pointer text-[18px] sm:text-[20px] flex-shrink-0"
                    />
                </h3>
            </div>

            <div className="p-2 sm:p-3">
                <CategoryCollapse />
            </div>
        </Box>
    );

    return (
        <>
            <Drawer
                open={props.isOpenCatPanel}
                onClose={toggleDrawer(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                    },
                }}
            >
                {DrawerList}
            </Drawer>
        </>
    );
};

export default CategoryPanel;
