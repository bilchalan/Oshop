import React,{useEffect} from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {useDispatch,useSelector} from 'react-redux';
import {deleteProduct, getProductsByAuthorizeRoles, resetMutationResult, selectAllProducts, selectProductMutationResult} from '../../../redux/features/productSlice';
import {toast} from 'react-toastify';
import {Link} from 'react-router-dom';

import {Box, Typography,IconButton, Tooltip} from '@mui/material';
import DeleteForeeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import BoxShadowLoader from '../../../components/Skeletons/BoxShadowLoader';

const ProductList = () => {
    const dispatch=useDispatch();
    const {loading, products}=useSelector(selectAllProducts);
    const {success} = useSelector(selectProductMutationResult);

    const deleteHandler=(id)=>{
        dispatch(deleteProduct({id,toast}));
    }

    const columns=[
        {field:'title', headerName:'Products', headerClassName:'gridHeader',flex:1,minWidth:170},
        {field:'description', headerName:'Description', headerClassName:'gridHeader',flex:1.5,minWidth:250},
        {
            field:'actions', 
            headerName:'Actions', 
            headerClassName:'gridHeader',
            flex:.5,
            minWidth:80,
            type:'number',
            sortable:false,
            renderCell:(params)=>{
                return (
                    <>
                        <Link to={`/authorized/product/${params.getValue(params.id,'id')}`}>
                        <Tooltip title='Edit' placement='top'>
                            <EditIcon sx={{width:'30px', height:'30px', color:'#1976d2'}} />
                        </Tooltip>
                        </Link>

                        <Tooltip title='Delete' placement='top'>
                            <IconButton color='error' 
                                        component='span' 
                                        onClick={()=>deleteHandler(params.getValue(params.id,'id'))}>
                                <DeleteForeeverIcon sx={{width:'30px', height:'30px'}}/>
                            </IconButton>
                        </Tooltip>

                    </>
                )
            }
        }
    ]
    const rows=[];
    products && products.forEach(product => {
        rows.push({
            id:product._id,
            title:product.title,
            description:product.description
        })
    });
    useEffect(() => {
        if(success){
            dispatch(resetMutationResult());
        } 
        dispatch(getProductsByAuthorizeRoles({toast}))
    }, [dispatch,success])
    
  return (
    <Box style={{displya:'flex', flexDirection:'column', width:'100%', marginTop:'15px', textAlign:'center'}}>
        <Typography component='h1' variant='h5'sx={{m:4}}>Full list of products</Typography>
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

export default ProductList