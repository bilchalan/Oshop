import React,{useState,useEffect} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {changePassword,selectMutationResult,resetMutationResult} from '../../redux/features/authSlice';



import {Box, Typography, TextField, Button} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

const UpdatePassword = () => {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const {loading,success}=useSelector(selectMutationResult);
    const [oldPassword, setOldPassword]=useState('');
    const [newPassword, setNewPassword]=useState('');
    const [confirmPassword, setConfirmPassword]=useState('');

    const handleSubmit=(e)=>{
      e.preventDefault();

      if(newPassword !== confirmPassword){
        toast.warn('New & confirm password not matched.');
        return;
      }
      const jsonData={
        newPassword,
        oldPassword
      }
      dispatch(changePassword({jsonData,toast}));
    }

    useEffect(() => {
      if(success){
        dispatch(resetMutationResult());
        navigate('/profile');
      }
    }, [success, navigate, dispatch])
    
  return (
    <Box sx={{maxWidth:'550px', m:'0 auto',textAlign:'center'}}>
        <Box sx={{m:1}}>
        <Typography component='h1' 
                    variant='h6'>Change Password
        </Typography>
        <Box sx={{bgcolor:'primary.main',color:'#fff',borderRadius:1,mb:3}}>
            <StarIcon/><StarIcon/><StarIcon/><StarIcon/><StarIcon/>
        </Box>

        <Box component='form' onSubmit={handleSubmit}>
        <TextField type='password'
                        id='oldPassword'
                        label='Old Password'
                        name='oldPassword'
                        margin='normal'
                        required
                        fullWidth
                        autoFocus
                        value={oldPassword}
                        onChange={(e=>setOldPassword(e.target.value))}
        />
        <TextField type='password'
                        id='newPassword'
                        label='New Password'
                        name='newPassword'
                        margin='normal'
                        required
                        fullWidth
                        value={newPassword}
                        onChange={(e=>setNewPassword(e.target.value))}
        />
        <TextField type='password'
                        id='confirmPassword'
                        label='Confirm Password'
                        name='confirmPassword'
                        margin='normal'
                        required
                        fullWidth
                        value={confirmPassword}
                        onChange={(e=>setConfirmPassword(e.target.value))}
        />
        <Button type='submit'
                        fullWidth
                        disabled={loading?true:false}
                        variant='contained'
                        sx={{mt:3,mb:2}}
                        >Update
        </Button>
        </Box>
        </Box>
    </Box>
  )
}

export default UpdatePassword