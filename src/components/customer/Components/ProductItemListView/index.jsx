import React from 'react'
import "../ProductItem/style.css"
import { Link } from 'react-router-dom'
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import { FaRegHeart } from "react-icons/fa";
import { GoGitCompare } from "react-icons/go";
import { MdOutlineZoomOutMap } from "react-icons/md";
import { MdOutlineShoppingCart } from "react-icons/md";
const ProductItem = () => {
    return (
        <div className='productItem  shadow-lg py-5 rounded-md overflow-hidden border-1 border-[rgba(0,0,0,0.1)] flex items-center'>
            <div className='group imgWrapper w-[25%]  overflow-hidden rounded-md relative'>
                <Link to='/'>
                    <div className='img h-[200px] overflow-hidden'>

                        <img src="https://img.lazcdn.com/g/p/69b28ff2c70a97b0b0078facbdb35ad7.jpg_400x400q80.jpg_.avif"
                            className=' w-full' />
                        {/* w-full */}

                        <img src="https://img.lazcdn.com/g/p/ec25d123320dcd986c5323a2ac3e4dd8.jpg_400x400q80.jpg_.avif"
                            className=' w-full transition-all duration-700 absolute top-0 left-0 opacity-0 group-hover:opacity-100 group-hover:scale-150' />
                        {/* w-full */}

                    </div>
                </Link>
                <span className='discount flex items-center absolute top-[10px] left-[10px] z-50 bg-red-400
                 text-white rounded-lg p-1 text-[12px] font-[500]'>10%</span>

                <div className='actions absolute top-[-200px] right-[5px] z-50 flex items-center gap-2 flex-col w-[50px]
                  transition-all duration-300 group-hover:top-[15px] opacity-0 group-hover:opacity-100'>
                    <Button className='!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white group text-black
                    hover:!bg-red-300 hover:text-white'>
                        <FaRegHeart className='text-[18px] !text-black group-hover:text-white hover:!text-white' />
                    </Button>

                    <Button className='!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white group text-black
                    hover:!bg-red-300 hover:text-white'>
                        <MdOutlineZoomOutMap className='text-[18px] !text-black group-hover:text-white hover:!text-whitee' />
                    </Button>

                    <Button className='!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white group text-black
                    hover:!bg-red-300 hover:text-white'>
                        <GoGitCompare className='text-[18px] !text-black group-hover:text-white hover:!text-white' />
                    </Button>


                </div>

            </div>

            <div className='info p-3 py-5 px-8 w-[75%]'>
                <h6 className='text-[15px] '>
                    <Link to='/' className='link'>
                        T-Shirt
                    </Link>
                </h6>
                <h3 className='text-[18px] title mt-3 mb-3  font-[500] mb-1 text-[#000]'>
                    <Link to='/' className='link transition-all'>
                        Ao ngan tay co tron cho nam mau den
                    </Link>
                </h3>
                <p className='text-[14px]'>
                    san pham duoc nhap tu kho quang chau
                </p>
                <Rating name="size-small" defaultValue={2} size="small" readOnly />

                <div className='flex items-center gap-4'>
                    <span className='oldPrice line-through text-gray-500 text-[15px] font-[500]'>$75.00</span>
                    <span className='price text-red-500 text-[15px] font-[600]'>$75.00</span>
                </div>

                <div className='mt-3'>
                    <Button className='btn-org flex gap-2'>
                        <MdOutlineShoppingCart className='text-[20px]' />
                        Add to cart
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ProductItem;
