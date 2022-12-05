import React,{useEffect} from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {useDispatch,useSelector} from 'react-redux';
import { getMyOrders,selectAllOrders} from '../../redux/features/orderSlice';
import {toast} from 'react-toastify';
import {Link} from 'react-router-dom';

import {Box, Typography, Tooltip} from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import BoxShadowLoader from '../Skeletons/BoxShadowLoader';

const MyOrders = () => {
    const dispatch=useDispatch();
    const {loading, orders}=useSelector(selectAllOrders);


    const columns=[
        {field:'id', headerName:'Order ID', headerClassName:'gridHeader',flex:1,maxWidth:90},
        {field:'status', headerName:'Status', headerClassName:'gridHeader',flex:1,minWidth:100},
        {field:'itemsQty', headerName:'Quantity', headerClassName:'gridHeader',flex:1,minWidth:100,type:'Number'},
        {field:'amount', headerName:'Amount', headerClassName:'gridHeader',flex:1,minWidth:80,type:'Number'},
        {
            field:'details', 
            headerName:'Details', 
            headerClassName:'gridHeader',
            flex:.5,
            minWidth:80,
            type:'number',
            sortable:false,
            renderCell:(params)=>{
                return (
                    <>
                        <Link to={`/order/${params.getValue(params.id,'id')}`}>
                        <Tooltip title='View Details' placement='top'>
                            <LaunchIcon sx={{width:'30px', height:'30px', color:'#1976d2'}} />
                        </Tooltip>
                        </Link>
                    </>
                )
            }
        }
    ]
    const rows=[];
    orders && orders.forEach(order => {
        rows.push({
            id:order._id,
            status:order.orderStatus,
            itemsQty:order.orderItems.length,
            amount:order.totalPrice
        })
    });
    useEffect(() => {
        dispatch(getMyOrders({toast}))
    }, [dispatch])
    
  return (
    <Box style={{displya:'flex', flexDirection:'column', width:'100%', marginTop:'15px', textAlign:'center'}}>
        <Typography component='h1' variant='h5'sx={{m:4}}>Full list of brands</Typography>
        {loading ? <BoxShadowLoader/>:
        <DataGrid rows={rows}
                    columns={columns}
                    components={{Toolbar:GridToolbar}}                    
                    autoHeight
        />
        }
    </Box>
  )
}

export default MyOrders