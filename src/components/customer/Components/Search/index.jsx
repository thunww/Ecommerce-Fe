import React from 'react'
import '../Search/style.css';
import Button from '@mui/material/Button';
import { IoSearchSharp } from "react-icons/io5";

const Search = () => {
    return (
        <div className='flex justify-center w-full'>
            <div className='searchBox w-full max-w-[500px] mx-auto h-[40px] sm:h-[45px] bg-[#e5e5e5] rounded-[10px] sm:rounded-[20px] relative p-1 sm:p-2' >
                <input
                    type='text'
                    placeholder='Search for products, brands and more'
                    className='w-full h-[30px] sm:h-[35px] focus:outline-none bg-inherit p-2 text-[13px] sm:text-[15px]' />
                <Button
                    className='!absolute top-[5px] sm:top-[5px] right-[2px] sm:right-[5px] z-10 !w-[30px] sm:!w-[35px] !min-w-0 h-[30px] sm:h-[35px] !rounded-full !text-black !p-0 sm:!p-1'>
                    <IoSearchSharp className='text-black text-[18px] sm:text-[20px]' />
                </Button>
            </div>
        </div>
    )
}

export default Search;
