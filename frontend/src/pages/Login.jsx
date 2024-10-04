import React, { useState } from 'react'
import {Link} from 'react-router-dom'
const Login = () => {

  const [state,setState]=useState('Sign Up');

  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [name,setName]=useState('')

  const onSubmitHandler = async (event)=>{
   event.preventDefault();
  }
  return (
    <form className='min-h-[80vh] flex items-center '>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-96 border rounded-xl text-zinc-600 shadow-lg'>
        <p className='text-2xl font-semibold'>{state==='Sign Up' ? 'Create Account':'Login'}</p>
        <p>Please {state==='Sign Up' ? 'Sign Up':'Log In'} to book appointment</p>
        {
          state ==='Sign Up' &&
          <div className='w-full'>
          <p>Full Name</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1 ' required type='text' onChange={(e)=>setName(e.target.value)} value={name}/>
        </div>
        }
        
        <div  className='w-full'>
          <p>Email</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1 ' required  type='email' onChange={(e)=>setEmail(e.target.value)} value={email}/>
        </div>
        <div  className='w-full'>
          <p>Password</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1 ' required  type='password' onChange={(e)=>setPassword(e.target.value)} value={password}/>
        </div>
        <button className='bg-primary text-white w-full py-2 rounded-md text-base'>{state==='Sign Up' ? 'Create Account':'Login'}</button>
        {
          state==='Sign Up' ? <p>Already have an account? <span onClick={()=>setState('login')} className='text-primary underline cursor-pointer'>Login Here</span></p>:
          <p>Don't have an account? <span onClick={()=>setState('Sign Up')} className='text-primary underline cursor-pointer'>Create Account</span></p>
        }
      </div>

    </form>
  )
}

export default Login