import React, {useState} from 'react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App.jsx';
import { ClipLoader } from "react-spinners";
import { isStrongPassword, isValidEmail, isValidOtp } from '../utils/validation';
import { logger } from '../utils/logger';

function ForgotPassword() {
  const [step, setStep] = React.useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error , setError] = useState("");
  const navigate=useNavigate();
  const [loading,setLoading]=useState(false);

  const handleSendOtp=async()=>{
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await axios.post(`${serverUrl}/api/auth/send-otp`,{email: email.trim().toLowerCase()},{withCredentials:true});
      setError("");
      setStep(2);
      setLoading(false);
    } catch (error) {
      setError(error?.response?.data?.message);
      setLoading(false);
      
    }
  }

  const handleVerifyOtp=async()=>{
    if (!isValidOtp(otp)) {
      setError("Please enter a valid OTP");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await axios.post(`${serverUrl}/api/auth/verify-otp`,{email: email.trim().toLowerCase(), otp: otp.trim()},{withCredentials:true});
      setError("");
      setStep(3);
      setLoading(false);
    } catch (error) {
      setError(error?.response?.data?.message);
      setLoading(false);
    }
  }

  const handleResetPassword=async()=>{
    if (!isStrongPassword(newPassword)) {
      setError(
        "Password must be 8+ characters with uppercase, lowercase, and a number",
      );
      return;
    }
    if(newPassword!==confirmPassword){
      setError("Passwords do not match");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await axios.post(`${serverUrl}/api/auth/reset-password`,{email: email.trim().toLowerCase(), newPassword},{withCredentials:true});
      setError("");
      setLoading(false);
      navigate("/signin");
    } catch (error) {
      logger.error("Reset password failed", error);
      setError(error?.response?.data?.message);
      setLoading(false);
    }
  }
  return (
    <div className='flex w-full items-center justify-center min-h-screen p-4 bg-[#fff9f6]'>
      <div className='bg-white rounded-xl shadow-lg w-full max-w-md p-8'>
        <div className='flex items-center gap-4 mb-4'>
          <IoIosArrowRoundBack size={30} className='text-[#ff4d2d] cursor-pointer' onClick={() => navigate("/signin")} />
         <h1 className='text-3xl font-bold text-center text-[#ff4d2d]'>Forgot Password</h1>
        </div>
        {
        step === 1 && 
         <div>
          {/* email */}
        <div className='mb-6'>
          <label htmlFor="email" className='block text-gray-700 font-medium mb-1'>Email</label>
          <input type="email" className='w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter your Email' onChange={(e)=>setEmail(e.target.value)} value={email} required/>
        </div>
        <button className={`w-full  mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`} onClick={handleSendOtp} disabled={loading}>{loading ? <ClipLoader size={20} color='white' /> : "Send Otp"}</button>

        {error && <p className='text-red-500 text-center my-2'>*{error}</p>}
         </div>}

         {step === 2 && 
         <div>
          {/* Otp */}
         <div className='mb-6'>
          <label htmlFor="otp" className='block text-gray-700 font-medium mb-1'>OTP</label>
          <input type="text" className='w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter your OTP' onChange={(e)=>setOtp(e.target.value)} value={otp} required/>
        </div>
        <button className={`w-full  mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`} onClick={handleVerifyOtp} disabled={loading}>{loading ? <ClipLoader size={20} color='white' /> : "Verify"}</button>
        {error && <p className='text-red-500 text-center my-2'>*{error}</p>}
         </div>}

         {step === 3 && 
         <div>
          {/* Verify */}
         <div className='mb-6'>
          <label htmlFor="newPassword" className='block text-gray-700 font-medium mb-1'>New Password</label>
          <input type="text" className='w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter New Password' onChange={(e)=>setNewPassword(e.target.value)} value={newPassword} required/>
        </div>
        <div className='mb-6'>
          <label htmlFor="ConfirmPassword" className='block text-gray-700 font-medium mb-1'>Confirm Password</label>
          <input type="text" className='w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter Confirm Password' onChange={(e)=>setConfirmPassword(e.target.value)} value={confirmPassword} required/>
        </div>
        <button className={`w-full  mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`} onClick={handleResetPassword} disabled={loading}>{loading ? <ClipLoader size={20} color='white'/> : "Reset Password"}</button>
        {error && <p className='text-red-500 text-center my-2'>*{error}</p>}
         </div>}

      </div>
    </div>
  )
}
export default ForgotPassword;