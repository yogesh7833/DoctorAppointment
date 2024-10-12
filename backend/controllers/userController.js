import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/AppointmentModel.js';
import razorpay from 'razorpay'
//Api to register use

const registerUser= async (req,res)=>{
    try {
        
        const {name, email,password}=req.body;

        if(!name || !email || !password){
            return res.json({
                success:false,
                message:'Missing Details'
            })
        }
         
        //validating email
        if(!validator.isEmail(email)){
            return res.json({
                success:false,
                message:'Enter a valid email'
            })
        }
           //validating strong password
        if(password.length<8){
            return res.json({
                success:false,
                message:'Enter a strong password'
            })
        }

        // hasing user passord 
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)
        const userData={
            name,
            email,
            password:hashedPassword,
        }

        const newUser=new userModel(userData)

        const user=await newUser.save()

        //
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET)

        res.json({
            success:true,token
        })


    } catch (error) {
        console.log(error)
       res.json({
            success:false,
            message:error.message
        })
    }
}


//API for user lOgin

const loginUser=async (req,res)=>{
    try {

        const {email,password}=req.body;

        const user=await userModel.findOne({email})

        if(!user){
           return res.json({
                success:false,
                message:"User does't exist"
            })
        }

        const isMatch=await bcrypt.compare(password,user.password)

        if(isMatch){
            const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
          return  res.json({
                success:true,
                token
            })
        }else{
           return  res.json({
                success:false,
                message:"Invalid credentials"
            })
        }


        
    } catch (error) {
        console.log(error)
       return res.json({
            success:false,
            message:error.message
        })
    }
}

//API to get user profile data

// 
// const getProfile = async (req, res) => {
//     try {
//         // Use req.userId set by the authUser middleware
//         const userId = req.userId; 

//         // Use findById correctly
//         const userData = await userModel.findById(userId).select('-password');

//         // Check if the user was found
//         if (!userData) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }

//         // Send the user data in the response
//         res.json({
//             success: true,
//             userData,
//         });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// }
const getProfile= async (req,res)=>{
    try {
        
        const {userId}=req.body
        const userData=await userModel.findById(userId).select('-password')
        res.json({
            success:true,
            userData,
        })
     

    } catch (error) {
        console.log(error)
        res.json({
            success:false,
            message:error.message
        })
    }
}


//Api to update user Profile 

const updateProfile=async (req,res)=>{
    try {

        const {userId,name,phone,address,dob,gender}=req.body
        const imageFile=req.file
        if(!name || !phone || !dob || !gender){
            return res.json({
                success:false,
                message:"Data is Missing"
            })
        }
        
        await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})
        if(imageFile){
            //upload image to cloudinary 
            const imageUpload= await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
            const imageURL=imageUpload.secure_url
            await userModel.findByIdAndUpdate(userId,{image:imageURL})
        }

        res.json({
            success:true,
            message:"Profile updated"
        })

    } catch (error) {
        console.log(error)
        res.json({
            success:false,
            message:error.message
        })
    }
}


//API to book Appointment

const bookAppointment = async (req,res)=>{
    try {

        const {userId,docId, slotDate, slotTime}=req.body

        const docData=await doctorModel.findById(docId).select('-password')

        if(!docData.available){
            return res.json({
                success:false,
                message:'Doctor is not available'
            })
        }

        let slots_booked =docData.slots_booked

        //checking for slots availablity
        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({
                    success:false,
                    message:'Slot not available'
                })
            }else{
                slots_booked[slotDate].push(slotTime)
            }
        }else{
            slots_booked[slotDate]=[]
            slots_booked[slotDate].push(slotTime)
        }

        const userData=await userModel.findById(userId).select('-password')
         
          delete docData.slots_booked

          const appointmentData={
            userId,
            docId,
            userData,
            docData,
            amount:docData.fees,
            slotTime,
            slotDate,
            date:Date.now()
          }

          const newAppointment = new appointmentModel(appointmentData)
            await newAppointment.save()

            //save new slots data in docData

         await doctorModel.findByIdAndUpdate(docId, {slots_booked})

         res.json({
            success:true,
            message:'Appointment Booked'
         })

    
    } catch (error) {
        console.log(error)
        res.json({
            success:false,
            message:error.message
        })
    }
}

//Api to get user Appointment for my-appointment

const listAppointment= async (req,res)=>{
    try {

        const {userId}=req.body;
        const appointments=await appointmentModel.find({userId})

        res.json({
            success:true,
            appointments
        })
        
    } catch (error) {
        console.log(error)
        res.json({
            success:false,
            message:error.message
        })
    }
}

// API to cencell appointment 
const cancelAppointment= async(req,res)=>{
    try {
        const {userId,appointmentId}=req.body

        const appointmentData=await appointmentModel.findById(appointmentId)
         
        //varify appointment user
        if(appointmentData.userId !==userId){
            return res.json({
                success:false,
                message:'Unothorized action'
            })
        }
         
        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

        //releasingn doctor slote

        const {docId,slotDate,slotTime}=appointmentData

        const doctorData=await doctorModel.findById(docId)

        let slots_booked=doctorData.slots_booked

        slots_booked[slotDate]=slots_booked[slotDate].filter(e => e!==slotTime)

        await doctorModel.findByIdAndUpdate(docId, {slots_booked})

        res.json({
            success:true,
            message:"Appointment cancelled"
        })
         
    } catch (error) {
        console.log(error)
        res.json({
            success:false,
            message:error.message
        })
    }
}
// const cancelAppointment = async (req, res) => {
//     try {
//       const { userId, appointmentId } = req.body;
  
//       const appointmentData = await appointmentModel.findById(appointmentId);
  
//       // Verify appointment user
//       if (appointmentData.userId.toString() !== userId) {
//         return res.json({
//           success: false,
//           message: 'Unauthorized action',
//         });
//       }
  
//       // Mark appointment as cancelled
//       await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
  
//       // Releasing doctor's slot
//       const { docId, slotDate, slotTime } = appointmentData;
//       const doctorData = await doctorModel.findById(docId);
  
//       let slots_booked = doctorData.slots_booked;
  
//       // Check if slotDate exists in slots_booked
//       if (slots_booked[slotDate]) {
//         slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
  
//         // Update the doctor's booked slots
//         await doctorModel.findByIdAndUpdate(docId, { slots_booked });
//       }
  
//       res.json({
//         success: true,
//         message: 'Appointment cancelled',
//       });
//     } catch (error) {
//       console.log(error);
//       res.json({
//         success: false,
//         message: error.message,
//       });
//     }
//   };

//API to make appointment
const razorpayInstance=new razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
})

const paymentRazorpay =async (req,res)=>{
   try {

    const {appointmentId}=req.body

    const appointmentData= await appointmentModel.findById(appointmentId)
 
    if(!appointmentData || appointmentData.cancelled){
     return res.json({
         success:false,
         message:"Appointment Cancelled or not found"
     })
    }
    //creating options for razorpay
    const options={
     amount:appointmentData.amount* 100,
     currency:process.env.CURRENCY,
     receipt:appointmentId,
    }
 
    //creation of an order
    const order=await razorpayInstance.orders.create(options)
 
    res.json({
     success:true,
     order
    })
    
   } catch (error) {
    console.log(error);
      res.json({
        success: false,
        message: error.message,
      });
   }
}

//API to verify Payment of razorpay 
 const verifyRazorpay =async (req,res)=>{
    try {
        const {razorpay_order_id}=req.body
        const orderInfo= await razorpayInstance.orders.fetch(razorpay_order_id)

        if(orderInfo.status==='paid'){
          await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
          res.json({
            success:true,
            message:"Payment successful"
          })
        }else{
            res.json({
                success:false,
                message:"Payment failed"
              })
        }
        
    } catch (error) {
        console.log(error);
      res.json({
        success: false,
        message: error.message,
      });
    }
 }
// const verifyRazorpay = async (req, res) => {
//     try {
//         const { razorpay_order_id } = req.body;  // or const { order_id } if needed

//         // Validate that razorpay_order_id is provided
//         if (!razorpay_order_id) {
//             return res.status(400).json({ success: false, message: "razorpay_order_id is mandatory" });
//         }

//         // Fetch the order information from Razorpay
//         const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

//         // Check the payment status
//         if (orderInfo.status === 'paid') {
//             // Update the appointment's payment status
//             await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
//             res.json({
//                 success: true,
//                 message: "Payment successful"
//             });
//         } else {
//             res.json({
//                 success: false,
//                 message: "Payment failed"
//             });
//         }

//     } catch (error) {
//         console.error(error);  // Use console.error for errors
//         res.json({
//             success: false,
//             message: error.message,
//         });
//     }
// };
// const verifyRazorpay = async (req, res) => {
//     console.log(req.body); // Log the request body to check the incoming data
//     try {
//         const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
//         const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
        
//         if (orderInfo.status === 'paid') {
//             await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
//             res.json({
//                 success: true,
//                 message: "Payment successful"
//             });
//         } else {
//             res.json({
//                 success: false,
//                 message: "Payment failed"
//             });
//         }
//     } catch (error) {
//         console.log(error);
//         res.json({
//             success: false,
//             message: error.message,
//         });
//     }
// }

export {registerUser,loginUser,getProfile,updateProfile,bookAppointment,listAppointment,cancelAppointment,paymentRazorpay,verifyRazorpay}
