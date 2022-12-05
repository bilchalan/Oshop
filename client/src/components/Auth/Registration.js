import React,{useState} from 'react';
import { useDispatch} from 'react-redux';
import {toast} from 'react-toastify';
import { registration } from '../../redux/features/authSlice';

import {Box, Avatar, Typography, TextField, Button, Grid, FormGroup, FormControlLabel, Checkbox, Link} from '@mui/material';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import AccountCircleIcon from'@mui/icons-material/AccountCircle';
import PhotoIcon from'@mui/icons-material/Photo'

const Registration = () => {
  const dispatch=useDispatch();
    const [name, setName]=useState('');
    const [email, setEmail]=useState('');
    const [password, setPassword]=useState('');
    const [checked, setChecked]=useState(false);

    const [previewAvatar,setPreviewAvatar]=useState('');
    const [avatar,setAvatar]=useState('');

    const imageHandler=(e)=>{
      console.log(e.target.name);
      if(e.target.name==='avatar'){
        setAvatar(e.target.files);
        const reader=new FileReader();
        reader.onload=()=>{
          if(reader.readyState===2){
            setPreviewAvatar(reader.result);
          }
        }
        reader.readAsDataURL(e.target.files[0]);
      }
    }
    const handleSubmit=(e)=>{
        e.preventDefault();
        if(avatar===''){
          toast.warn('Please select a profile picture');
          return false;
        }
        const formData=new FormData();
        formData.set('name',name);
        formData.set('email',email);
        formData.set('password',password);
        Object.keys(avatar).forEach(key=>{
          formData.append(avatar.item(key).name,avatar.item(key));
        })
        dispatch(registration({formData,toast}));
    }
    const handleKeepMeLoggedIn=()=>{

    }
  return (
    <>
    <Box sx={{marginTop:2, display:'flex',flexDirection:'column',alignItems:'center'}}>
        <Avatar sx={{m:1,bgcolor:'primary.main'}}>
            <NoAccountsIcon/>
        </Avatar>
        <Typography component='div' variant='h5'>Registration</Typography>

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
            <TextField type='email'
                        id='email'
                        label='Email'
                        name='email'
                        margin='normal'
                        required
                        fullWidth
                        autoComplete='email'
                        value={email}
                        onChange={(e=>setEmail(e.target.value))}
            />
            <TextField type='password'
                        id='password'
                        label='Password'
                        name='password'
                        margin='normal'
                        required
                        fullWidth
                        autoFocus
                        value={password}
                        onChange={(e=>setPassword(e.target.value))}
            />
            <Grid container style={{alignItems:'center',margin:'10px 0'}}>
                <Grid item xs>
                  <Avatar sx={{m:1,bgcolor:'primary.main', height:'80px',width:'80px',fontSize:'5.35rem'}}>
                    {!previewAvatar ?
                    <AccountCircleIcon fontSize='2.5rem'/>
                    :
                    <img src={previewAvatar} alt={previewAvatar} style={{width:80,height:80}}/>
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
                    Upload Profile Picture
                  </Button>
                </Grid>
            </Grid>
            <Button type='submit'
                        fullWidth
                        variant='contained'
                        sx={{mt:3,mb:2}}
            >Registration & Login</Button>

            <Grid container style={{}}>
                <Grid item xs>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox/>}
                                            label='Keep me logged in.'
                                            checked={checked}
                                            onChange={handleKeepMeLoggedIn}
                        />
                    </FormGroup>
                </Grid>
            </Grid>
        </Box>  
    </Box>
    </>
  )
}

export default Registration