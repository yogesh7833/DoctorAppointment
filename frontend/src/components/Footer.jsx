import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            {/* left section   */}
            <div>
                <img className='mb-5 w-40' src={assets.logo}/>
                <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem ipsum Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro, molestiae? dolor sit amet consectetur adipisicing elit. Possimus, ducimus?</p>

            </div>

            {/* center section   */}
            <div>
                <p className='text-xl font-medium mb-5 '>COMPANY</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Contact us</li>
                    <li>Privacy Policy</li>
                </ul>
                
            </div>

            {/* rgiht section   */}
            <div>
                <p>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>+1-121-112-1212</li>
                    <li>userappontment@gmail.com</li>
                </ul>
                
            </div>
        </div>

        {/* copy right text  */}
        <div>
            <hr/>
            <p className='py-5 text-sm text-center '>Created with ❤️ By Yogesh</p>
        </div>
    </div>
  )
}

export default Footer