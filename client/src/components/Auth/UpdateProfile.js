import React,{useState,useEffect} from 'react';
import {Box, Typography, TextField, Button, Avatar, Grid} from '@mui/material';
import PhotoIcon from'@mui/icons-material/Photo';

import {selectLoggedInUser,updateProfile,resetMutationResult,selectMutationResult} from '../../redux/features/authSlice';
import {useDispatch,useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import { IMAGE_BASEURL } from '../../constants/baseURL';
import {toast} from 'react-toastify';

const UpdateProfile = () => {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const {user}=useSelector(selectLoggedInUser);
    const {loading,success}=useSelector(selectMutationResult);
 
    const [name, setName]=useState('');
    const [profileImage,setProfileImage]=useState('');
    const [previewProfileImage,setPreviewProfileImage]=useState('');
    const [file,setFile]=useState('');

    const imageHandler=(e)=>{
      setFile(e.target.files);
      const reader=new FileReader();

      reader.onload=()=>{
        if(reader.readyState===2){
          setPreviewProfileImage(reader.result);
        }
      }
      reader.readAsDataURL(e.target.files[0]);
    }
    const handleSubmit=(e)=>{
      e.preventDefault();

      const formData=new FormData();
      formData.set('name',name);
      if((file!=='') || (file!==null)){
        Object.keys(file).forEach(key=>{
          formData.append(file.item(key).name, file.item(key))
        })
      }
      dispatch(updateProfile({formData,toast}));
    }

    useEffect(() => {
      if(user){
        setName(user.name);
        setProfileImage(user.avatar.url);
      }
    }, [user]);

    useEffect(()=>{
      if(success){
        dispatch(resetMutationResult());
        navigate('/profile');
      }
    },[success,navigate,dispatch]);
    
  return (
    <Box sx={{maxWidth:'550px', m:'0 auto', display:'flex', flexGrow:1, alignItems:'center'}}>
        <Box sx={{m:1,p:2, textAlign:'center'}}>
          <Typography component='h1' variant='h6'>Update Profile</Typography>
          <Box component='form' onSubmit={handleSubmit}>
          <TextField type='text'
                        id='name'
                        label='Name'
                        name='name'
                        margin='normal'
                        required
                        fullWidth
                        autoFocus
                        value={name}
                        onChange={(e=>setName(e.target.value))}
            />
            <Grid container style={{alignItems:'center',margin:'10px 0'}}>
                <Grid item xs>
                  <Avatar sx={{m:1,bgcolor:'primary.main', height:'80px',width:'80px',fontSize:'5.35rem'}}>
                    {previewProfileImage===''?
                      <img src={IMAGE_BASEURL+profileImage} 
                            alt={name} 
                            style={{ width:80,height:80}}
                      />
                    :
                      <img src={previewProfileImage} 
                            alt={name} 
                            style={{ width:80,height:80}}
                      />                     
                    }
                  </Avatar>
                </Grid>
                <Grid>
                  <Button fullWidth
                          variant='contained'
                          component='label'
                          startIcon={<PhotoIcon/>}
                  >
                    <input type='file' 
                            hidden
                            name='avatar'
                            onChange={imageHandler}
                    />
                    Change Profile Picture
                  </Button>
                </Grid>
            </Grid>
            <Button type='submit'
                        fullWidth
                        disabled={loading?true:false}
                        variant='contained'
                        sx={{mt:3,mb:2}}
                        >Update Profile
            </Button>
          </Box>
        </Box>
    </Box>
  )
}

export default UpdateProfile