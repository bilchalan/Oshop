import React from 'react';
import {useSelector} from 'react-redux';
import {Link} from 'react-router-dom';

import {Box, Typography, Grid, Card} from '@mui/material';

import {selectLoggedInUser} from '../../redux/features/authSlice';
import { IMAGE_BASEURL } from '../../constants/baseURL';
import jwtDecode from 'jwt-decode';

const UserProfile = () => {

  const {user,accessToken}=useSelector(selectLoggedInUser);
  const {UserInfo}=jwtDecode(accessToken);
  return (
    <Box sx={{maxWidth:'550px', m:'0 auto', display:'flex', flexGrow:1, alignItems:'center'}}>
      <Card sx={{m:1,p:2, minWidth:'450px'}}>
        <Box sx={{textAlign:'center'}}>
          <Typography component='h1' 
                      variant='h6'>Account Deatil's
          </Typography>
          <img src={IMAGE_BASEURL+user.avatar.url} 
                alt={user.name} 
                style={{width:80,height:80,borderRadius:'50%', margin:'0 auto'}}
          />
        </Box>

        <Grid container>
          <Grid item xs><Typography variant='button' component='div'>User's Name</Typography></Grid>
          <Grid item><Typography variant='button' component='div'>{user.name}</Typography></Grid>
        </Grid>
        <Grid container>
          <Grid item xs><Typography variant='button' component='div'>Role</Typography></Grid>
          <Grid item><Typography variant='button' component='div'>{UserInfo.roles}</Typography></Grid>
        </Grid>
        <Grid container>
          <Grid item xs><Typography variant='button' component='div'>E - mail</Typography></Grid>
          <Grid item><Typography variant='button' component='div'>{UserInfo.email}</Typography></Grid>
        </Grid>
        <Grid container>
          <Grid item xs><Typography variant='button' component='div'>Joined Date</Typography></Grid>
          <Grid item><Typography variant='button' component='div'>{String(user.createdAt).substr(0,10)}</Typography></Grid>
        </Grid>
        <Grid container sx={{mt:2}}>
          <Grid item xs><Link to='/me/update'>Update Profile</Link></Grid>
          <Grid item><Link to='/password/update'>Change Password</Link></Grid>
        </Grid>

      </Card>
    </Box>
  )
}

export default UserProfile