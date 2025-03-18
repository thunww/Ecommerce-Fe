import React from 'react'
import { Link } from 'react-router-dom'
import { MdOutlineDelete } from "react-icons/md";
import Button from '@mui/material/Button';
import MyContext from '../../../../context/MyContext';
const CartPanel = () => {

    return (
        <>
            <div className="scroll w-full max-h-[550px] overflow-y-scroll overflow-x-hidden py-3 px-4">
                <div className="cartItem w-full flex items-center gap-4 border-b border-[rgba(0,0,0,0.1)] pb-4">
                    <div className="img w-[25%] overflow-hidden h-[80px] rounded-md">
                        <Link to="/product/45875 " className='block group'>
                            <img src="https://img.lazcdn.com/g/p/69b28ff2c70a97b0b0078facbdb35ad7.jpg_400x400q80.jpg_.avif"
                                className="w-full group-hover:scale-105" />
                        </Link>
                    </div>

                    <div className="info w-[75%] pr-5 relative">

                        <h4 className="text-[16px] font-[500] ">
                            <Link to="/product/5485" className='link transition-all'>Ao ngan tay co tron cho nam mau den</Link>
                        </h4>
                        <p className='flex items-center gap-5 mt-2 mb-2'>
                            <span>
                                Qty: <span> 2 </span>
                                <span className='text-red-500 font-bold'>
                                    Price:$25
                                </span>
                            </span>
                        </p>

                        <MdOutlineDelete className='absolute top-[10px] right-[10px] cursor-pointer text-[20px] link transition-all' />
                    </div>
                </div>

                <div className="cartItem w-full flex items-center gap-4 border-b border-[rgba(0,0,0,0.1)] pb-4">
                    <div className="img w-[25%] overflow-hidden h-[80px] rounded-md">
                        <Link to="/product/45875 " className='block group'>
                            <img src="https://img.lazcdn.com/g/p/69b28ff2c70a97b0b0078facbdb35ad7.jpg_400x400q80.jpg_.avif"
                                className="w-full group-hover:scale-105" />
                        </Link>
                    </div>

                    <div className="info w-[75%] pr-5 relative">

                        <h4 className="text-[16px] font-[500] ">
                            <Link to="/product/5485" className='link transition-all'>Ao ngan tay co tron cho nam mau den</Link>
                        </h4>
                        <p className='flex items-center gap-5 mt-2 mb-2'>
                            <span>
                                Qty: <span> 2 </span>
                                <span className='text-red-500 font-bold'>
                                    Price:$25
                                </span>
                            </span>
                        </p>

                        <MdOutlineDelete className='absolute top-[10px] right-[10px] cursor-pointer text-[20px] link transition-all' />
                    </div>
                </div>

                <div className="cartItem w-full flex items-center gap-4 border-b border-[rgba(0,0,0,0.1)] pb-4">
                    <div className="img w-[25%] overflow-hidden h-[80px] rounded-md">
                        <Link to="/product/45875 " className='block group'>
                            <img src="https://img.lazcdn.com/g/p/69b28ff2c70a97b0b0078facbdb35ad7.jpg_400x400q80.jpg_.avif"
                                className="w-full group-hover:scale-105" />
                        </Link>
                    </div>

                    <div className="info w-[75%] pr-5 relative">

                        <h4 className="text-[16px] font-[500] ">
                            <Link to="/product/5485" className='link transition-all'>Ao ngan tay co tron cho nam mau den</Link>
                        </h4>
                        <p className='flex items-center gap-5 mt-2 mb-2'>
                            <span>
                                Qty: <span> 2 </span>
                                <span className='text-red-500 font-bold'>
                                    Price:$25
                                </span>
                            </span>
                        </p>

                        <MdOutlineDelete className='absolute top-[10px] right-[10px] cursor-pointer text-[20px] link transition-all' />
                    </div>
                </div>

                <div className="cartItem w-full flex items-center gap-4 border-b border-[rgba(0,0,0,0.1)] pb-4">
                    <div className="img w-[25%] overflow-hidden h-[80px] rounded-md">
                        <Link to="/product/45875 " className='block group'>
                            <img src="https://img.lazcdn.com/g/p/69b28ff2c70a97b0b0078facbdb35ad7.jpg_400x400q80.jpg_.avif"
                                className="w-full group-hover:scale-105" />
                        </Link>
                    </div>

                    <div className="info w-[75%] pr-5 relative">

                        <h4 className="text-[16px] font-[500] ">
                            <Link to="/product/5485" className='link transition-all'>Ao ngan tay co tron cho nam mau den</Link>
                        </h4>
                        <p className='flex items-center gap-5 mt-2 mb-2'>
                            <span>
                                Qty: <span> 2 </span>
                                <span className='text-red-500 font-bold'>
                                    Price:$25
                                </span>
                            </span>
                        </p>

                        <MdOutlineDelete className='absolute top-[10px] right-[10px] cursor-pointer text-[20px] link transition-all' />
                    </div>
                </div>

                <div className="cartItem w-full flex items-center gap-4 border-b border-[rgba(0,0,0,0.1)] pb-4">
                    <div className="img w-[25%] overflow-hidden h-[80px] rounded-md">
                        <Link to="/product/45875 " className='block group'>
                            <img src="https://img.lazcdn.com/g/p/69b28ff2c70a97b0b0078facbdb35ad7.jpg_400x400q80.jpg_.avif"
                                className="w-full group-hover:scale-105" />
                        </Link>
                    </div>

                    <div className="info w-[75%] pr-5 relative">

                        <h4 className="text-[16px] font-[500] ">
                            <Link to="/product/5485" className='link transition-all'>Ao ngan tay co tron cho nam mau den</Link>
                        </h4>
                        <p className='flex items-center gap-5 mt-2 mb-2'>
                            <span>
                                Qty: <span> 2 </span>
                                <span className='text-red-500 font-bold'>
                                    Price:$25
                                </span>
                            </span>
                        </p>

                        <MdOutlineDelete className='absolute top-[10px] right-[10px] cursor-pointer text-[20px] link transition-all' />
                    </div>
                </div>

                <div className="cartItem w-full flex items-center gap-4 border-b border-[rgba(0,0,0,0.1)] pb-4">
                    <div className="img w-[25%] overflow-hidden h-[80px] rounded-md">
                        <Link to="/product/45875 " className='block group'>
                            <img src="https://img.lazcdn.com/g/p/69b28ff2c70a97b0b0078facbdb35ad7.jpg_400x400q80.jpg_.avif"
                                className="w-full group-hover:scale-105" />
                        </Link>
                    </div>

                    <div className="info w-[75%] pr-5 relative">

                        <h4 className="text-[16px] font-[500] ">
                            <Link to="/product/5485" className='link transition-all'>Ao ngan tay co tron cho nam mau den</Link>
                        </h4>
                        <p className='flex items-center gap-5 mt-2 mb-2'>
                            <span>
                                Qty: <span> 2 </span>
                                <span className='text-red-500 font-bold'>
                                    Price:$25
                                </span>
                            </span>
                        </p>

                        <MdOutlineDelete className='absolute top-[10px] right-[10px] cursor-pointer text-[20px] link transition-all' />
                    </div>
                </div>
            </div>

            <br />

            <div className='bottomSec absolute bottom-[10px] left-[10px] w-full overflow-hidden pr-5'>

                <div className='bottomInfo w-full py-3 px-4 border-t border-[rgba(0,0,0,0.1)] flex items-center justify-between flex-col'>
                    <div className='flex items-center justify-between w-full'>
                        <span className='text-[14px] font-[600]'>1 item</span>
                        <span className='text-red-500 font-bold'>$86.00</span>
                    </div>

                    <div className='flex items-center justify-between w-full'>
                        <span className='text-[14px] font-[600]'>Shipping</span>
                        <span className='text-red-500 font-bold'>$7.00</span>
                    </div>
                    <div className='bottomInfo w-full py-3 px-4 border-t border-[rgba(0,0,0,0.1)] flex items-center justify-between flex-col'>
                        <div className='flex items-center justify-between w-full'>
                            <span className='text-[14px] font-[600]'>ToTal(tax excl.)</span>
                            <span className='text-red-500 font-bold'>$93.00</span>
                        </div>
                    </div>
                    <br />
                    <div className='flex items-center justify-between w-full gap-5'>
                        <Link to="/cart" className='w-[50%] d-block'> <Button className='btn-org btn-lg w-full'>View Cart</Button></Link>
                        <Link to="/checkout" className='w-[50%] d-block'> <Button className='btn-org btn-lg w-full '>Checkout</Button></Link>
                    </div>

                </div>
            </div>
        </>
    )
}

export default CartPanel
