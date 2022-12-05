import React,{useEffect} from 'react';
import {toast} from 'react-toastify';
import {Typography, Box,Grid, Divider} from '@mui/material';
import {useSelector,useDispatch} from 'react-redux';
import {selectUserList,getAllUsers} from '../../../redux/features/authSlice';
import {selectAllProducts,getProductsByAuthorizeRoles} from '../../../redux/features/productSlice';
import {getAllOrders,selectAllOrders} from '../../../redux/features/orderSlice';
import {getStores,selectAllStores} from '../../../redux/features/storeSlice';

import {Doughnut,Line} from 'react-chartjs-2';
import chart from 'chart.js/auto';


const AdminDashboard = () => {

    const dispatch=useDispatch();
    const {products}=useSelector(selectAllProducts);
    const {users}=useSelector(selectUserList);
    const {orders}=useSelector(selectAllOrders);
    const {stores}=useSelector(selectAllStores);

    const outOfStock=0;
    products && products.forEach((item)=>{
        if(item.stock===0){
            outOfStock+=1;
        }
    })

    let totalAmount=0;
    orders && orders.forEach((item)=>{
        totalAmount+=item.totalPrice;
    })


    useEffect(() => {
      dispatch(getProductsByAuthorizeRoles({toast}));
      dispatch(getAllOrders({toast}));
      dispatch(getAllUsers({toast}));
      dispatch(getStores({toast}));
    }, [dispatch]);

    const lineData={
        labels:['Initial Amount','Amount Earned'],
        datasets:[
            {
                label:'Total Amount',
                backgroundColor:['tomato'],
                hoverBackgroundColor:['orange'],
                data:[0,totalAmount]
            }
        ]
    }

    const doughnutData={
        labels:['Out Of Stock','In Stock'],
        datasets:[
            {
                backgroundColor:['red','green'],
                hoverBackgroundColor:['black','blue'],
                data:[outOfStock,products.length-outOfStock]
            }
        ]
    }
    
  return (
    <>
    <Box className='dash-box'>
    <Grid container sx={{alignItems:'center',mt:1,textAlign:'center'}} spacing={3}>
        <Grid item xs={4}>
            <Typography variant='button' component='div' sx={{color:'#fff', background:'#1976d2'}}>Products</Typography>
            <Divider/>
            <Typography variant='button' component='div'>{products && products.length}</Typography>
        </Grid>

        <Grid item xs={4}>
            <Typography variant='button' component='div' sx={{color:'#fff', background:'#1976d2'}}>Users</Typography>
            <Divider/>
            <Typography variant='button' component='div'>{users && users.length}</Typography>
        </Grid>

        <Grid item xs={4}>
            <Typography variant='button' component='div' sx={{color:'#fff', background:'#1976d2'}}>Stores</Typography>
            <Divider/>
            <Typography variant='button' component='div'>{stores && stores.length}</Typography>
        </Grid>

        <Grid item xs={6}>
            <Typography variant='button' component='div' sx={{color:'#fff', background:'#1976d2'}}>Orders</Typography>
            <Divider/>
            <Typography variant='button' component='div'>{orders && orders.length}</Typography>
        </Grid>

        <Grid item xs={6}>
            <Typography variant='button' component='div' sx={{color:'#fff', background:'#1976d2'}}>Ordered Amount</Typography>
            <Divider/>
            <Typography variant='button' component='div'>{orders && totalAmount}</Typography>
        </Grid>

    </Grid>

        <Grid container sx={{alignItems:'center',mt:1,textAlign:'center'}} spacing={3}>
        <Grid item xs={5}><Line data={lineData}/></Grid>
        <Grid item xs={5}> <Doughnut data={doughnutData}/></Grid>
        </Grid>
    </Box>
    </>
  )
}

export default AdminDashboard