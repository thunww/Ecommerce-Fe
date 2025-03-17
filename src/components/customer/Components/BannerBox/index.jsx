import React from 'react'
import { Link } from 'react-router-dom';
const BannerBox = (props) => {
    return (
        <div>
            <div className='box bannerBox overflow-hidden rounded-lg group'>
                <Link to='/'>
                    <img src={props.img} className='w-full transition-all group-hover:scale-105 
                    group-hover:rotate-1' alt='banner' />
                </Link>
            </div>
        </div>
    )
}

export default BannerBox;
