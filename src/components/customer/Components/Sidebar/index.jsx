import React, { useState } from 'react'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import "../Sidebar/style.css";
import { Collapse } from 'react-collapse';
import { FaAngleDown } from "react-icons/fa6";
import Button from '@mui/material/Button';
import { FaAngleUp } from "react-icons/fa6";
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import Rating from '@mui/material/Rating';
const Sidebar = () => {
    const [isOpenCategoryFilter, setIsOpenCategoryFilter] = useState(true);
    const [isOpenAvailFilter, setIsOpenAvailFilter] = useState(true);
    const [isOpenSizeFilter, setIsOpenSizeFilter] = useState(true);
    return (
        <aside className='sidebar py-3'>
            <div className='box'>
                <h3 className='w-full mb-3 text-[18px] font-[500] flex items-center pr-5'>
                    Shop By Category
                    <Button className=' !w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[#000]'
                        onClick={() => setIsOpenCategoryFilter(!isOpenCategoryFilter)}>
                        {
                            isOpenCategoryFilter ? <FaAngleUp /> : <FaAngleDown />
                        }
                    </Button>
                </h3>
                <Collapse isOpened={isOpenCategoryFilter}>
                    <div className='scroll px-4 ralative -left-[13px]'>
                        <FormControlLabel control={<Checkbox size="small" />} label="Fashion" className='w-full' />
                        <FormControlLabel control={<Checkbox size="small" />} label="Electronics" className='w-full' />
                        <FormControlLabel control={<Checkbox size="small" />} label="Bags" className='w-full' />
                        <FormControlLabel control={<Checkbox size="small" />} label="Footwear" className='w-full' />
                        <FormControlLabel control={<Checkbox size="small" />} label="Groceries" className='w-full' />
                        <FormControlLabel control={<Checkbox size="small" />} label="Beauty" className='w-full' />
                        <FormControlLabel control={<Checkbox size="small" />} label="Wellness" className='w-full' />
                        <FormControlLabel control={<Checkbox size="small" />} label="Jawellery" className='w-full' />
                    </div>
                </Collapse>
            </div>

            <div className='box'>
                <h3 className='w-full mb-3 text-[18px] font-[500] flex items-center pr-5'>
                    Availability
                    <Button className=' !w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[#000]'
                        onClick={() => setIsOpenAvailFilter(!isOpenAvailFilter)}>
                        {
                            isOpenAvailFilter ? <FaAngleUp /> : <FaAngleDown />
                        }
                    </Button>
                </h3>
                <Collapse isOpened={isOpenAvailFilter}>
                    <div className='scroll px-4 ralative -left-[13px]'>
                        <FormControlLabel control={<Checkbox size="small" />} label="Available (100)" className='w-full' />
                        <FormControlLabel control={<Checkbox size="small" />} label="In Stock (100)" className='w-full' />
                        <FormControlLabel control={<Checkbox size="small" />} label="Not Available (100)" className='w-full' />
                    </div>
                </Collapse>
            </div>

            <div className='box mt-3'>
                <h3 className='w-full mb-3 text-[18px] font-[500] flex items-center pr-5'>
                    Size
                    <Button className=' !w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[#000]'
                        onClick={() => setIsOpenSizeFilter(!isOpenSizeFilter)}>
                        {
                            isOpenSizeFilter ? <FaAngleUp /> : <FaAngleDown />
                        }
                    </Button>
                </h3>
                <Collapse isOpened={isOpenSizeFilter}>
                    <div className='scroll px-4 ralative -left-[13px]'>
                        <FormControlLabel control={<Checkbox size="small" />} label="S (100)" className='w-full' />
                        <FormControlLabel control={<Checkbox size="small" />} label="M (100)" className='w-full' />
                        <FormControlLabel control={<Checkbox size="small" />} label="L (100)" className='w-full' />
                        <FormControlLabel control={<Checkbox size="small" />} label="XL (100)" className='w-full' />
                        <FormControlLabel control={<Checkbox size="small" />} label="XXL (100)" className='w-full' />
                        <FormControlLabel control={<Checkbox size="small" />} label="Chuppy (100)" className='w-full' />
                    </div>
                </Collapse>
            </div>

            <div className='box mt-4'>
                <h3 className='w-full mb-3 text-[18px] font-[500] flex items-center pr-5'>
                    Filter by Price
                </h3>

                <RangeSlider />
                <div className='flex pt-4 pb-2 priceRange'>
                    <span className='text-[13px]'>
                        From: <strong className='text-dark'>Rs: 1</strong>
                    </span>
                    <span className='ml-auto text-[13px]'>
                        From: <strong className='text-dark'>Rs: 100</strong>
                    </span>
                </div>

            </div>

            <div className='box mt-4'>
                <h3 className='w-full mb-3 text-[18px] font-[500] flex items-center pr-5'>
                    Filter by Rating
                </h3>
                <div className='w-full'>
                    <Rating name="size-small" defaultValue={5} size="small" readOnly className='cursor-pointer' />
                </div>
                <div className='w-full'>
                    <Rating name="size-small" defaultValue={4} size="small" readOnly className='cursor-pointer' />
                </div>
                <div className='w-full'>
                    <Rating name="size-small" defaultValue={3} size="small" readOnly className='cursor-pointer' />
                </div>
                <div className='w-full'>
                    <Rating name="size-small" defaultValue={2} size="small" readOnly className='cursor-pointer' />
                </div>
                <div className='w-full'>
                    <Rating name="size-small" defaultValue={1} size="small" readOnly className='cursor-pointer' />
                </div>


            </div>
        </aside>
    )
}

export default Sidebar
