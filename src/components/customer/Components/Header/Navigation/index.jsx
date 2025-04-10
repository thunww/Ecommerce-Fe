import React from 'react'
import { useState } from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { FaAngleDown } from "react-icons/fa6";
import { MdDeliveryDining } from "react-icons/md";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import CategoryPanel from './CategoryPanel';
import '../Navigation/style.css';

const Navigation = () => {
  const [isOpenCatPanel, setIsOpenCatPanel] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  const openCategoryPanel = () => {
    setIsOpenCatPanel(true);
  }
  return (
    <>
      <nav >
        <div className='container flex items-center justify-end gap-7'>
          <div className='col1 w-[20%]'>
            <Button className='!text-black gap-2 w-full ' onClick={openCategoryPanel}>
              <HiOutlineMenuAlt1 className='text-[18px]' />
              Shop by Categories
              <FaAngleDown className='text-[14px] ml-auto font-bold curson-pointer' />
            </Button>
          </div>
          <div className='col2 w-[60%]'>
            <ul className='flex items-center gap-5 nav '>
              <li className='list-none'>
                <Link to='/' className='link transition text-[15px] font-[500]' >
                  <Button className='link transition !font-[500] !text-black hover:!text-[red] !py-4  '>Home</Button>
                </Link>
              </li>
              <li className='list-none relative'>
                <Link to='/productListing' className='link transition text-[15px] font-[500]' >
                  <Button className='link transition !font-[500] !text-black hover:!text-[red]  !py-4 '>Fashion</Button>
                </Link>

                <div className='submenu absolute top-[120%] left-[0%] min-w-[200px] bg-white shadow-md opacity-0 transition-all '>
                  <ul>
                    <li className='list-none w-full'>
                      <Link to='/' className='w-full' >
                        <Button className='!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none '>  Men</Button>
                      </Link>
                    </li>
                    <li className='list-none w-full'>
                      <Link to='/' className='w-full' >
                        <Button className='!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start  !rounded-none'>  Women</Button>
                      </Link>
                    </li>
                    <li className='list-none w-full'>
                      <Link to='/' className='w-full' >
                        <Button className='!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none'>  Kids</Button>
                      </Link>
                    </li>
                    <li className='list-none w-full'>
                      <Link to='/' className='w-full' >
                        <Button className='!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none'>  Boys</Button>
                      </Link>
                    </li>
                    <li className='list-none w-full'>
                      <Link to='/' className='w-full' >
                        <Button className='!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none'>  Girls</Button>
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              <li className='list-none'>
                <Link to='/' className='link transition text-[15px] font-[500]' >
                  <Button className='link transition !font-[500] !text-black hover:!text-[red]  !py-4 '>Electronics</Button>
                </Link>
              </li>
              <li className='list-none'>
                <Link to='/' className='link transition text-[15px] font-[500]' >
                  <Button className='link transition !font-[500] !text-black hover:!text-[red]  !py-4 '>Bags</Button>
                </Link>
              </li>
              <li className='list-none'>
                <Link to='/' className='link transition text-[15px] font-[500]' >
                  <Button className='link transition !font-[500] !text-black hover:!text-[red]  !py-4 '>Footwear</Button>
                </Link>
              </li>
              <li className='list-none'>
                <Link to='/' className='link transition text-[15px] font-[500]' >
                  <Button className='link transition !font-[500] !text-black hover:!text-[red]  !py-4 '>Groceries</Button>
                </Link>
              </li>
              <li className='list-none'>
                <Link to='/' className='link transition text-[15px] font-[500]' >
                  <Button className='link transition !font-[500] !text-black hover:!text-[red]  !py-4 '>Beauty</Button>
                </Link>
              </li>
              <li className='list-none'>
                <Link to='/' className='link transition text-[15px] font-[500]' >
                  <Button className='link transition !font-[500] !text-black hover:!text-[red]  !py-4 '>Wellness</Button>
                </Link>
              </li>
            </ul>
          </div>
          <div className='col3 w-[20%]'>
            <p className='text-[14px] font-[500] flex items-center gap-3 mb-0 mt-0'>
              <MdDeliveryDining className='text-[18px]' />
              FREE NATIONAL DELIVERY
            </p>
          </div>
        </div>
      </nav>

      {/* category component */}
      <CategoryPanel
        isOpenCatPanel={isOpenCatPanel}
        setIsOpenCatPanel={setIsOpenCatPanel}
      />
    </>

  )
}

export default Navigation;
