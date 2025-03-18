import React, { useState } from 'react'
import QtyBox from '../QtyBox';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { GoGitCompare } from "react-icons/go";
const ProductDetailsComponent = () => {
    const [productActionIndex, setProductActionIndex] = useState(null);
    return (
        <>
            <h1 className='text-[24px] font-[600] mb-2'>
                Ten San Pham 1
            </h1>
            <div className='flex items-center gap-3'>
                <span className='text-gray-400 text-[13px]'>Brands: <span className='font-[500] text-black opacity-75'>
                    Brand 1
                </span>
                </span>
                <Rating name="size-small" defaultValue={2} size="small" readOnly />
                <span className='text-[13px] cursor-pointer'>ReView (5)</span>
            </div>

            <div className='flex items-center gap-4 mt-4'>
                <span className='oldPrice line-through text-gray-500 text-[20px] font-[500]'>$75.00</span>
                <span className='price text-red-500 text-[20px] font-[600]'>$75.00</span>
                <span className='text-[14px]'>Available In Stock:
                    <span className='text-green-600  font-bold'>147 Items</span>
                </span>
            </div>

            <br />
            <p className='mt-3 pr-10 mb-5'>Mo Ta Brands or San Pham</p>

            <div className='flex items-center gap-3'>
                <span className='text-[16px]'>Size:</span>
                <div className='flex items-center gap-1 actions'>
                    <Button
                        className={`${productActionIndex === 0 ? '!bg-red-500 !text-white' : ''}`}
                        onClick={() => setProductActionIndex(0)}>S
                    </Button>
                    <Button
                        className={`${productActionIndex === 1 ? '!bg-red-500 !text-white' : ''}`}
                        onClick={() => setProductActionIndex(1)}>M
                    </Button>
                    <Button
                        className={`${productActionIndex === 2 ? '!bg-red-500 !text-white' : ''}`}
                        onClick={() => setProductActionIndex(2)}>L
                    </Button>
                    <Button
                        className={`${productActionIndex === 3 ? '!bg-red-500 !text-white' : ''}`}
                        onClick={() => setProductActionIndex(3)}>XL
                    </Button>
                </div>

            </div>

            <div className='flex items-center gap-4 py-4'>
                <div className='qtyBoxWrapper w-[70px]'>
                    <QtyBox />
                </div>

                <Button className='btn-org flex gap-2'>
                    <MdOutlineShoppingCart className='text-[22px]' />
                    Add to Cart
                </Button>
            </div>


            <div className='flex items-center gap-4 mt-4'>
                <span className='flex items-center gap-2 mt-4 text-[14px] link cursor-pointer font-[500]'>
                    <FaRegHeart className='text-[18px] text-[#000]' />
                    Add to Wishlish
                </span>
                <span className='flex items-center gap-2 mt-4 text-[14px] link cursor-pointer font-[500]'>
                    <GoGitCompare className='text-[18px] text-[#000]' />
                    Add to Compare
                </span>
            </div>
        </>
    )
}

export default ProductDetailsComponent
