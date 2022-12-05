import React,{useEffect} from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {useDispatch,useSelector} from 'react-redux';
import {deleteCategory, getCategories, resetMutationResult, selectAllCategories, selectCategoryMutationResult} from '../../../redux/features/categorySlice';
import {toast} from 'react-toastify';
import {Link} from 'react-router-dom';

import {Box, Typography,IconButton, Tooltip} from '@mui/material';
import DeleteForeeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import BoxShadowLoader from '../../../components/Skeletons/BoxShadowLoader';

const CategoryList = () => {
    const dispatch=useDispatch();
    const {loading, categories}=useSelector(selectAllCategories);
    const {success} = useSelector(selectCategoryMutationResult);

    const deleteHandler=(id)=>{
        dispatch(deleteCategory({id,toast}));
    }

    const columns=[
        {field:'title', headerName:'Categories', headerClassName:'gridHeader',flex:1,minWidth:170},
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
                        <Link to={`/authorized/category/${params.getValue(params.id,'id')}`}>
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
    categories && categories.forEach(category => {
        rows.push({
            id:category._id,
            title:category.title,
            description:category.description
        })
    });
    useEffect(() => {
        if(success){
            dispatch(resetMutationResult());
        } 
        dispatch(getCategories({toast}))
    }, [dispatch,success])
    
  return (
    <Box style={{displya:'flex', flexDirection:'column', width:'100%', marginTop:'15px', textAlign:'center'}}>
        <Typography component='h1' variant='h5'sx={{m:4}}>Full list of categories</Typography>
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

export default CategoryList