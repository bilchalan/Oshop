import React,{useState} from 'react'
import { NavLink } from 'react-router-dom';

import MenuIcon from '@mui/icons-material/Menu';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { IconButton } from '@mui/material';



const DrawerMenu = () => {
    const [open, setOpen]=useState(false);
  return (
    <>
        <IconButton onClick={()=>setOpen(true)} sx={{color:'#fff'}}>
            <MenuIcon/>
        </IconButton>
        <SwipeableDrawer anchor='left'
                        open={open}
                        onClose={()=>setOpen(false)}
                        onOpen={()=>{}}
        >
          <nav className='mnwrapper'>
            <NavLink to='/' className={({isActive})=>isActive?'active':''}>
              Home
            </NavLink>
            <NavLink to='/product' className={({isActive})=>isActive?'active':''}>
              Product
            </NavLink>
            <NavLink to='/about-us' className={({isActive})=>isActive?'active':''}>
              About Us
            </NavLink>
            <NavLink to='/contact-us' className={({isActive})=>isActive?'active':''}>
              Contact Us
            </NavLink>
          </nav>

        </SwipeableDrawer>
    </>
  )
}

export default DrawerMenu