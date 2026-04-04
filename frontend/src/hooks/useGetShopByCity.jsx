import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios';
import { serverUrl } from '../config/env';
import { useDispatch, useSelector } from 'react-redux';
import { setShopInMyCity } from '../redux/userSlice.js';


function useGetShopByCity() {
    const dispatch=useDispatch();
    const {currentCity}=useSelector(state=>state.user);
    
    useEffect(() => {
        // Agar city valid nahi hai to return kar do
        if (!currentCity || currentCity === 'null' || currentCity === 'undefined') {
            return;
        }
        
        const fetchShops =async ()=>{
            try {
                const result = await axios.get(`${serverUrl}/api/shop/get-by-city/${currentCity}`,{withCredentials:true});
                dispatch(setShopInMyCity(result.data));
                console.log(result.data)
            } catch (error) {
                console.log("Error in fetching current user",error);
            }
        }
        fetchShops();
    }, [currentCity, dispatch]);
    
}

export default useGetShopByCity