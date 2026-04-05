// import React, { useRef } from 'react'
import * as React from 'react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { FaUtensils } from "react-icons/fa";
import { useState } from 'react';
import { serverUrl } from '../config/env';
import axios from 'axios';
import { setMyShopData } from '../redux/ownerSlice';
import { useEffect } from 'react';
import { ClipLoader } from 'react-spinners';


function EditItem() {
    const navigate = useNavigate();
    //const {myShopData}=useSelector((state)=>state.owner);
    const {itemId} = useParams();
    const [currentItem, setCurrentItem]=useState(null);
    const[name,setName]=useState("");
    const[price,setPrice]=useState("");
    const [category,setCategory]=useState("");
    const[foodType,setFoodType]=useState("");    
    const [loading,setLoading]=useState(false);
    const categories=["Snacks",
            "Main Course",
            "Desserts",
            "Pizza",
            "Burgers",
            "Sandwiches",
            "South Indian",
            "North Indian",
            "Chinese",
            "Fast Food",
            "Others"]
    const [frontendImage,setFrontendImage]=useState("");
    const [backendImage,setBackendImage]=useState(null);

    const dispatch=useDispatch();
    const handelImage=(e)=>{
        const file=e.target.files[0];
        setBackendImage(file);
        setFrontendImage(URL.createObjectURL(file));
    }

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setLoading(true);
        try {
            const formData=new FormData();
            formData.append("name",name);
            formData.append("category",category);
            formData.append("foodType",foodType);
            formData.append("price",price);
            if(backendImage){
                formData.append("image",backendImage);
            }
            const result= await axios.post(`${serverUrl}/api/item/edit-item/${itemId}`, formData, {withCredentials:true})
            dispatch(setMyShopData(result.data))
            setLoading(false);
            setTimeout(() => {
                navigate("/");
            }, 100);
        } catch (error) {
            console.log(error);
            setLoading(false);  
        }
    }

    useEffect(()=>{
        const handleGetItemById=async () =>{
            try {
                const result=await axios.get(`${serverUrl}/api/item/get-by-id/${itemId}`,{withCredentials:true});
                setCurrentItem(result.data);
            } catch (error) {
                console.log(error);
            }
        }
        handleGetItemById();
    },[itemId])

    useEffect(()=>{
        setName(currentItem?.name || "")
        setPrice(currentItem?.price || "")
        setCategory(currentItem?.category || "")
        setFoodType(currentItem?.foodType || "")
        setFrontendImage(currentItem?.image || null)
    },[currentItem])
  return (
    <div className='flex justify-center flex-col items-center p-6 bg-linear-to-br from-orange-50 relative to-white min-h-screen'>
      <div className='absolute top-5 left-5 z-10 mb-2.5' onClick={()=> navigate("/")}>
        <IoIosArrowRoundBack size={35} className='text-[#7F00FF]'/>
      </div>
      <div className='max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100'>
        <div className='flex flex-col items-center mb-6'>
            <div className='bg-orange-100 p-4 rounded-full mb-4'>
                <FaUtensils className='text-[#7F00FF] w-16 h-16'/>
            </div>
            <div className='text-3xl font-extrabold text-gray-900'>
                 Edit Food
            </div>

        </div>
        {/* Form Starts Here */}
        <form className='space-y-5 ' onSubmit={handleSubmit}>
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
                <input type="text" placeholder='Enter Item Name' className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ' onChange={(e)=>setName(e.target.value)} value={name}/>
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Food Image</label>
                <input type="file" accept='image/*' className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ' onChange={handelImage} />
                {frontendImage && <div className='mt-4'>
                    <img src={frontendImage} alt=""  className='w-full h-48 object-cover rounded-lg border'/>
                </div>}
                
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Price</label>
                <input type="number" placeholder='0' className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ' onChange={(e)=>setPrice(Number(e.target.value))} value={price}/>
            </div>
            {/* <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Price</label>
                <input type="number" placeholder='0' className='w-full px-4 py-2 vorder rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ' onChange={(e)=>setPrice(e.target.value)} value={price}/>
            </div> */}
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'> Select Category</label>
                <select className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ' onChange={(e)=>setCategory(e.target.value)} value={category}>
                    <option value="">Select Category</option>
                    {categories.map((cate, index) => (
                        <option value={cate} key={index}>{cate}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'> Select Food Type</label>
                <select className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ' onChange={(e)=>setFoodType(e.target.value)} value={foodType}>
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                </select>
            </div>
            <button className='w-full bg-[#7F00FF] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-[#6500CC] hover:shadow-lg transition-all duration-200 cursor-pointer' disabled={loading}>
                {loading? <ClipLoader size={20} color='white'/> : "Save"}

            </button>
        </form>

      </div>
    </div>
  )
}

export default EditItem

