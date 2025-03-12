import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { FiPlusSquare, FiMinusSquare } from "react-icons/fi";
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';

const CategoryPanel = (props) => {
    const [openSubmenus, setOpenSubmenus] = useState({
        fashion: false,
        shoes: false,
        electronics: false,
        beauty: false,
        wellness: false,
        groceries: false,
    });

    const toggleDrawer = (newOpen) => () => {
        props.setIsOpenCatPanel(newOpen);
    };

    const handleToggleSubmenu = (category) => {
        setOpenSubmenus((prev) => ({
            ...prev,
            [category]: !prev[category],
        }));
    };

    const buttonClass = 'w-full !text-left !justify-between !px-3 !text-black !flex !items-center';
    const submenuClass = 'transition-all duration-300 ease-in-out overflow-hidden';

    const getIcon = (isOpen) => isOpen ? <FiMinusSquare className='cursor-pointer' /> : <FiPlusSquare className='cursor-pointer' />;

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" className='categoryPanel'>
            <h3 className='p-3 text-[20px] font-[500] flex items-center justify-between'>
                Shop By Category{' '}
                <IoClose onClick={toggleDrawer(false)} className='cursor-pointer text-[20px]' />
            </h3>

            <div className='scroll'>
                <ul className='w-full'>

                    {/* Fashion */}
                    <li className='list-none'>
                        <Button className={buttonClass} onClick={() => handleToggleSubmenu('fashion')}>
                            Fashion {getIcon(openSubmenus.fashion)}
                        </Button>
                        <div className={`${submenuClass} ${openSubmenus.fashion ? 'max-h-40' : 'max-h-0'}`}>
                            <ul className='pl-3 pr-3'>
                                <li className='list-none'>
                                    <Button className={buttonClass} onClick={() => handleToggleSubmenu('shoes')}>
                                        Shoes {getIcon(openSubmenus.shoes)}
                                    </Button>
                                    <div className={`${submenuClass} ${openSubmenus.shoes ? 'max-h-40' : 'max-h-0'}`}>
                                        <ul className='pl-3 pr-3'>
                                            <li className='list-none'>
                                                <Link to="/shoes/sport">
                                                    <Button className={buttonClass}>Sport Shoes</Button>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </li>

                    {/* Electronics */}
                    <li className='list-none'>
                        <Button className={buttonClass} onClick={() => handleToggleSubmenu('electronics')}>
                            Electronics {getIcon(openSubmenus.electronics)}
                        </Button>
                        <div className={`${submenuClass} ${openSubmenus.electronics ? 'max-h-40' : 'max-h-0'}`}>
                            <ul className='pl-3 pr-3'>
                                <li className='list-none'>
                                    <Link to="/electronics/phones">
                                        <Button className={buttonClass}>Phones</Button>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </li>

                    {/* Beauty */}
                    <li className='list-none'>
                        <Button className={buttonClass} onClick={() => handleToggleSubmenu('beauty')}>
                            Beauty {getIcon(openSubmenus.beauty)}
                        </Button>
                        <div className={`${submenuClass} ${openSubmenus.beauty ? 'max-h-40' : 'max-h-0'}`}>
                            <ul className='pl-3 pr-3'>
                                <li className='list-none'>
                                    <Link to="/beauty/makeup">
                                        <Button className={buttonClass}>Makeup</Button>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </li>

                    {/* Wellness */}
                    <li className='list-none'>
                        <Button className={buttonClass} onClick={() => handleToggleSubmenu('wellness')}>
                            Wellness {getIcon(openSubmenus.wellness)}
                        </Button>
                        <div className={`${submenuClass} ${openSubmenus.wellness ? 'max-h-40' : 'max-h-0'}`}>
                            <ul className='pl-3 pr-3'>
                                <li className='list-none'>
                                    <Link to="/wellness/spa">
                                        <Button className={buttonClass}>Spa Treatments</Button>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </li>

                    {/* Groceries */}
                    <li className='list-none'>
                        <Button className={buttonClass} onClick={() => handleToggleSubmenu('groceries')}>
                            Groceries {getIcon(openSubmenus.groceries)}
                        </Button>
                        <div className={`${submenuClass} ${openSubmenus.groceries ? 'max-h-40' : 'max-h-0'}`}>
                            <ul className='pl-3 pr-3'>
                                <li className='list-none'>
                                    <Link to="/groceries/vegetables">
                                        <Button className={buttonClass}>Vegetables</Button>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </li>

                </ul>
            </div>
        </Box>
    );

    return (
        <Drawer open={props.isOpenCatPanel} onClose={toggleDrawer(false)}>
            {DrawerList}
        </Drawer>
    );
};

export default CategoryPanel;
