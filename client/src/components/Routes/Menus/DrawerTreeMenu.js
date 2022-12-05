import React,{useState} from 'react'
import { NavLink } from 'react-router-dom';

import MenuIcon from '@mui/icons-material/Menu';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { IconButton, Box } from '@mui/material';
import TreeMenu from './TreeMenu';



const DrawerTreeMenu = () => {
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
            <Box sx={{background:'#1976d2',height:'100vh', width:'60vw'}}>
                <TreeMenu/>
            </Box>
        </SwipeableDrawer>
    </>
  )
}

export default DrawerTreeMenu