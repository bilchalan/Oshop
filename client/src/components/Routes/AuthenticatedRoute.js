import React,{useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate, Outlet} from 'react-router-dom';

import {selectLoggedInUser} from '../../redux/features/authSlice';
import BoxShadowLoader from '../Skeletons/BoxShadowLoader';

const ProtectedRoute = () => {
    const navigate=useNavigate();
    const {accessToken}=useSelector(selectLoggedInUser);
    useEffect(()=>{
        if(!accessToken){
            navigate('/auth');
        }
    },[accessToken,navigate]);
  return accessToken ? <Outlet/> : <BoxShadowLoader/>
}

export default ProtectedRoute