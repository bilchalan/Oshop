import React,{useEffect,useState} from 'react';
import {useParams} from 'react-router-dom';
import {useSelector,useDispatch} from 'react-redux';
import {toast} from 'react-toastify';
import BoxShadowLoader from '../../../components/Skeletons/BoxShadowLoader';

import {Box, Typography,TextField, Button} from '@mui/material';
import UpdateIcon from '@mui/icons-material/Update';
import { categoryDetails, resetMutationResult, selectCategoryDetails, selectCategoryMutationResult, updateCategory } from '../../../redux/features/categorySlice';

const UpdateCategory = () => {
    const {id}=useParams();
    const dispatch=useDispatch();

    const [title,setTitle]=useState('');
    const [description,setDescription]=useState('');

    const {loading, category}=useSelector(selectCategoryDetails);
    const {loading:isUdating, success}=useSelector(selectCategoryMutationResult);

    const handleSubmit=(e)=>{
        e.preventDefault();
        const jsonData={title,description};
        dispatch(updateCategory({id,jsonData,toast}));
    }

    useEffect(() => {
        if(success){
            dispatch(resetMutationResult());
        }
        dispatch(categoryDetails({id,toast}));
    }, [dispatch,id,success]);

    useEffect(() => {
        if(category)
        {
            setTitle(category.title);
            setDescription(category.description);
        }
      }, [category]);
    
  return (
    <>
    {loading ? <BoxShadowLoader/> :
    <Box sx={{marginTop:2, display:'flex',flexDirection:'column',alignItems:'center'}}>
        <Typography component='div' variant='h5'>Update category</Typography>
        <Box component='form' onSubmit={handleSubmit}>
            <TextField type='text'
                        id='title'
                        label='Title'
                        name='title'
                        margin='normal'
                        required
                        fullWidth
                        autoFocus
                        value={title}
                        onChange={(e=>setTitle(e.target.value))}
            />
            <TextField type='text'
                        id='description'
                        label='Description'
                        name='description'
                        margin='normal'
                        required
                        fullWidth
                        autoFocus
                        value={description}
                        onChange={(e=>setDescription(e.target.value))}
            />
            <Button type='submit'
                        fullWidth 
                        disabled={isUdating?true:false}                       
                        variant='contained'
                        startIcon={<UpdateIcon/>}
                        sx={{mt:3,mb:2}}
            >Update Category</Button>
        </Box>
    </Box>
    }
    </>
  )
}

export default UpdateCategory