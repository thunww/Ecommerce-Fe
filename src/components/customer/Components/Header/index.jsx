import React from 'react'
import { Link } from 'react-router-dom';
import Search from '../Search';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { MdNotificationsNone } from "react-icons/md";
import Tooltip from '@mui/material/Tooltip';
import Navigation from './Navigation';
const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: -3,
        top: 13,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '0 4px',
    },
}));

const Header = () => {
    return (
        <header>
            <div className='top-strip py-1 border-t-[2px] border-blue-500 bg-blue-600 border-b-[2px] '>
                <div className='container'>
                    <div className='flex items-center justify-between'>
                        <div className='col1 w-[50%]'>
                            <p className='text-white text-[12px] font-[500]'>Get up to 50% off new season styles, limited time only.
                            </p>
                        </div>

                        <div className='col2 flex items-center justify-end '>
                            <ul className='flex items-center gap-3' >
                                <li className='list-none'>
                                    <Link to="/help-center" className='text-white text-[12px] link font-[500] transition '>Help Center</Link>
                                </li>
                                <li className='list-none'>
                                    <Link to="/order-tracking" className='text-white text-[12px] link font-[500] transition '>Order Tracking</Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>


            <div className='header py-3 border-b-[2px] border-blue-500'>
                <div className='container flex items-center justify-between'>
                    <div className='col1 w-[25%]'>
                        <Link to="/" className='logo'>
                            <img src='/logo.jpg' alt='logo' />
                        </Link>
                    </div>
                    <div className='col2 w-[50%]'>
                        <Search />
                    </div>
                    <div className='col3 w-[30%] 
                    flex items-center pl-7'>
                        <ul className='flex items-center justify-end gap-6 w-full'>


                            <li>
                                <Tooltip title="Cart">
                                    <IconButton aria-label="cart">
                                        <StyledBadge badgeContent={69} color="secondary">
                                            <MdOutlineShoppingCart />
                                        </StyledBadge>
                                    </IconButton>
                                </Tooltip>
                            </li>
                            <li>
                                <Tooltip title="Wishlist">
                                    <IconButton aria-label="cart">
                                        <StyledBadge badgeContent={69} color="secondary">
                                            <FaRegHeart />
                                        </StyledBadge>
                                    </IconButton>
                                </Tooltip>
                            </li>
                            <li>
                                <Tooltip title="Notification">
                                    <IconButton aria-label="cart">
                                        <StyledBadge badgeContent={69} color="secondary">
                                            <MdNotificationsNone />
                                        </StyledBadge>
                                    </IconButton>
                                </Tooltip>
                            </li>

                            <li className='list-none'>
                                <Link to="/login" className='text-black text-[14px] link font-[500] transition'>Login</Link>  |  &nbsp;
                                <Link to="/register" className='text-black text-[14px] link font-[500] transition'>SignUp</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <Navigation />
        </header>
    )
}

export default Header;
