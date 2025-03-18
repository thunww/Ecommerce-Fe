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
        <Box sx={{ width: 250 }} role="presentation" className="categoryPanel">
            <h3 className="p-3 text-[20px] font-[500] flex items-center justify-between">
                Shop By Category{" "}
                <IoCloseSharp
                    onClick={toggleDrawer(false)}
                    className="cursor-pointer text-[20px]"
                />
            </h3>

            <CategoryCollapse />

        </Box>
    );

    return (
        <>
            <Drawer open={props.isOpenCatPanel} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </>
    );
};

export default CategoryPanel;
