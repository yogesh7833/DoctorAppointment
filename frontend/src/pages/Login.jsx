import React, { useContext, useEffect, useState } from 'react'

import { AppContext } from '../context/AppContext';
import axios from 'axios'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const Login = () => {

  const { backendUrl,token, setToken}=useContext(AppContext)
   const navigate=useNavigate();
  const [state,setState]=useState('Sign Up');

  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [name,setName]=useState('')

  const onSubmitHandler = async (event)=>{
   event.preventDefault();
      
      try {
          
        if(state==='Sign Up'){
          
          const {data}=await axios.post(backendUrl + '/api/user/register',{name,password,email})
          // const {data}=await axios.get(backendUrl + '/api/doctor/list')
          if(data.success){
            localStorage.setItem('token',data.token)
            setToken(data.token)
            toast.success('Sign up Successfull')
          }else{
            toast.error(data.message)
          }
        }else{
          const {data}=await axios.post(backendUrl + '/api/user/login',{password,email})
          if(data.success){
            localStorage.setItem('token',data.token)
            setToken(data.token)
            toast.success('Login successfull')
          }else{
            toast.error(data.message)
          }
        }


      } catch (error) {
        toast.error(error.message)
      }

  }
  useEffect(()=>{
    if(token){
      navigate('/')
    }
  },[token])


  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center '>
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
        <button type='submit' className='bg-primary text-white w-full py-2 rounded-md text-base'>{state==='Sign Up' ? 'Create Account':'Login'}</button>
        {
          state==='Sign Up' ? <p>Already have an account? <span onClick={()=>setState('login')} className='text-primary underline cursor-pointer'>Login Here</span></p>:
          <p>Don't have an account? <span onClick={()=>setState('Sign Up')} className='text-primary underline cursor-pointer'>Create Account</span></p>
        }
      </div>

    </form>
  )
}

export default Login