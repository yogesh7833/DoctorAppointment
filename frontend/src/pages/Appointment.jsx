import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointment = () => {
  const {docId}=useParams();
  const navigate=useNavigate()

  const {doctors,currencySymbol,backendUrl, token, getDoctorsData}=useContext(AppContext);
  const daysofWeek=['SUN','MON','TUE','WED','THU','FRI','SAT']
  const [docInfo,setDocInfo]=useState(null);
  const [docSlots,setDocSlots]=useState([])
  const [slotIndex,setSlotIndex]=useState(0)
  const [slotTime,setSlotTime]=useState('')


  const fetchDocInfo= async ()=>{
    const docInfo=doctors.find(doc=>doc._id===docId)
    setDocInfo(docInfo);
    console.log(docInfo);
  }

  const getAvailableSlots= async ()=>{
    setDocSlots([])

    //getting current date 
    let today =new Date()

    for(let i=0;i<7;i++){
      //getting date and index
      let currentDate=new Date(today);
      currentDate.setDate(today.getDate()+i)

      //setting end time of the date with index
      let endTime=new Date()
      endTime.setDate(today.getDate()+i)
      endTime.setHours(21,0,0,0)

      //setting hours
      if(today.getDate()===currentDate.getDate()){
        currentDate.setHours(currentDate.getHours()>10 ?currentDate.getHours() + 1 :10)
        currentDate.setMinutes(currentDate.getMinutes()> 30 ? 30:0)
      }else{
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let timeSlots=[]
      while(currentDate<endTime){
        let formattedTime=currentDate.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})
           
        //add slots to array
        timeSlots.push({
          datetime:new Date(currentDate),
          time:formattedTime
        })

        // increment current by 30 minut 
        currentDate.setMinutes(currentDate.getMinutes()+30)
      }
      setDocSlots(prev=>([...prev, timeSlots]))
    }
    
  }

  const bookAppointment= async ()=>{
    if(!token){
      toast.warn('Login to book appointment')
      return navigate('/login')
    }

    try {
      const date=docSlots[slotIndex][0].datetime

      let day=date.getDate()
      let month=date.getMonth()+1
      let year=date.getFullYear()

      const slotDate= day +"_" + month + "_"+year
      
      const {data}=await axios.post(backendUrl + '/api/user/book-appointment',{docId,slotDate,slotTime},{headers:{token}})
       
      if(data.success){
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointments')
      }else{
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }


  }

  useEffect(()=>{
    fetchDocInfo();
  },[doctors,docId])

  useEffect(()=>{
    getAvailableSlots();
  },[docInfo])

  useEffect(()=>{
  console.log(docSlots);
  },[docSlots])


  return docInfo && (
    <div>
      {/* doctor detail  */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image}/>
        </div>

        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:max-0 mt-[-80px] sm:mt-0'>
          {/* // doc info like name degree info  */}
          <p className='flex items-center gap-2 text-2xl font-medium '>{docInfo.name}<img className='w-5' src={assets.verified_icon}/></p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree}-{docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full '>{docInfo.experience}</button>
          </div>

          {/* Doctor About  */}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>About <img src={assets.info_icon}/></p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
          <p className='text-gray-500 font-medium mt-4'>Appointment fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span></p>
        </div>
      </div>

      {/* Booking slots  */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>BOOking slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {
            docSlots.length && docSlots.map((item,index)=>(
              <div onClick={()=>setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex===index ? 'bg-primary text-white':'border border-gray-200'}`}  key={index}>
                 <p>{item[0] && daysofWeek[item[0].datetime.getDay()]}</p>
                 <p>{item[0] && item[0].datetime.getDate()}</p>
              </div>
            ))
          }
        </div>
        <div className='flex items-center gap-3 w-full overflow-y-scroll mt-4'>
          {
            docSlots.length && docSlots[slotIndex].map((item,index)=>(
              <p onClick={()=>setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time===slotTime ? 'bg-primary text-white':'text-gray-400 border border-gray-300 '}`} key={index}>
                {item.time.toLowerCase()}
              </p>
            ))
          }
        </div>
        <button onClick={bookAppointment} className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>Book an appointment</button>
      </div>
      {/* Listing related doctors  */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>
    </div>
  )
}

export default Appointment