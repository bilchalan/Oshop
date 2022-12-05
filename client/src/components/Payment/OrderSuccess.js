import React from 'react';
import {Link} from 'react-router-dom';

import {Box, Avatar, Typography} from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const OrderSuccess = () => {
  return (
    <>
    <Box sx={{m:'20px auto', maxWidth:'550px',textAlign:'center',minWidth:'500px'}}>
            <Avatar sx={{bgcolor:'primary.main',height:'80px',width:'80px',m:'0 auto',}} fontSize='4.5rem'>
                <DoneAllIcon fontSize='3.5rem'/>
            </Avatar>
            <Typography variant='h5' component='h1' sx={{color:'green',mt:1,mb:1}}>Your order has been placed successfully.</Typography>
            <Link to='/orders' style={{marginRight:'50px'}}>View orders</Link>
            <Link to='/'>Go Home</Link>
    </Box>
    
    </>
  )
}

export default OrderSuccess