import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image}/>
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-700'>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident accusamus, fugit fugiat ipsa quis molestiae iusto! Earum aliquam, distinctio unde dolorum rerum delectus recusandae deserunt omnis aliquid nemo debitis ullam!</p>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Asperiores illo saepe, quibusdam ea debitis ullam consequatur ratione corrupti, numquam voluptatibus sint? Quidem, esse iure necessitatibus exercitationem tenetur voluptatum ratione illum natus iste vero ea dolorem nobis consequatur magni, pariatur at!</p>
          <b className='text-gray-800'>Our Vision</b>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rem minima ea consequuntur facere fugiat soluta, voluptas atque numquam voluptates molestias placeat ut molestiae provident. Voluptate aperiam atque nobis ab dolores!</p>
        </div>
      </div>

      <div className='text-xl my-4 '>
      <p>Why <span className='text-gray-700 font-semibold'>Choose Us</span> </p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300'>
          <b>Efficiency:</b>
          <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300'>
        <b>Convenience:</b>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300'>
        <b>Personalization</b>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing.</p>
        </div>
      </div>
    </div>
  )
}

export default About
