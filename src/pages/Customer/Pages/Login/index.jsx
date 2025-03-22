
import React from 'react'

import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';

import { MdOutlineEmail } from "react-icons/md";
const Login = () => {
    return (
        <section className='section py-10'>
            <div className='container'>
                <div className='card shadow-md w-[500px] m-auto rounded-md bg-white p-5 px-12'>
                    <h3 className='text-center text-[18px] text-black'>Login to your account</h3>
                    <form className='w-full mt-5'>
                        <FormControl variant="standard">
                            <InputLabel htmlFor="input-with-icon-adornment">
                                With a start adornment
                            </InputLabel>
                            <Input
                                id="input-with-icon-adornment"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <MdOutlineEmail />
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        {/* <div className='form-group w-full mt-5'>

                        </div>
                        <div className='form-group w-full mt-5 relative'>
                            <TextField id="password" label="Password" variant="outlined" className='w-full' />
                        </div> */}
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Login;
