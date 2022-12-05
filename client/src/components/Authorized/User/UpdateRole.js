import React,{useEffect,useState} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import { useParams } from 'react-router-dom';
import {toast} from 'react-toastify';
import { getUserDetails,selectUserDetails, updateUserRole,selectMutationResult, resetMutationResult } from '../../../redux/features/authSlice';
import {getStores,selectAllStores} from '../../../redux/features/storeSlice';
import { IMAGE_BASEURL } from '../../../constants/baseURL';

import {Box, Typography, Grid, Divider, FormControl, InputLabel, Select,MenuItem, Button} from '@mui/material';
import UpdateIcon from '@mui/icons-material/Update';

const UpdateRole = () => {
    const {id}=useParams();
    const dispatch=useDispatch();
    const [role,setRole]=useState('');
    const [blocked,setBlocked]=useState('');
    const [store,setStore]=useState('');
    const {user}=useSelector(selectUserDetails);
    const {stores}=useSelector(selectAllStores);

    const {success}=useSelector(selectMutationResult);

    const submitHandler=(e)=>{
        e.preventDefault();

        if(role==='seller' && store===''){
            toast.error('Please select a store');
            return;
        }
        const jsonData={
            roles:role,store,blocked
        }
        dispatch(updateUserRole({id,jsonData,toast}));
    }

    useEffect(() => {                
        if(success){
            dispatch(resetMutationResult());
        }
        dispatch(getUserDetails({id,toast}))
        dispatch(getStores({toast}));
    }, [id,dispatch,success]);

    useEffect(() => {
        setRole(user?.roles);
        setBlocked(user?.blocked);
        user?.roles[0]==='seller' || user?.roles==='seller' ? setStore(user.store) : setStore('');
    }, [user])
    
    
  return (
    <Box sx={{maxWidth:'550px', m:'0 auto', display:'flex', flexGrow:1, alignItems:'center'}}>
        <Box>
            <Box sx={{textAlign:'center'}}>
            <Typography component='h1' 
                        variant='h6'>Account Deatil's
            </Typography>
            <img src={IMAGE_BASEURL+user?.avatar?.url} 
                    alt={user.name} 
                    style={{width:80,height:80,borderRadius:'50%', margin:'0 auto'}}
            />
            </Box>


            <Grid container sx={{alignItems:'center',mt:1}}>

            <Grid item xs={6}><Typography variant='button' component='div'>User's Name</Typography></Grid>
            <Grid item xs={6}><Typography variant='button' component='div'>{user?.name}</Typography></Grid>

            <Grid item xs={6}><Typography variant='button' component='div'>User's Email</Typography></Grid>
            <Grid item xs={6}><Typography variant='button' component='div'>{user?.email}</Typography></Grid>

            <Grid item xs={6}><Typography variant='button' component='div'>Joined date:</Typography></Grid>
            <Grid item xs={6}><Typography variant='button' component='div'>{String(user?.createdAt).substr(0,10)}</Typography></Grid>

            <Grid item xs={6}><Typography variant='button' component='div'>User's Role</Typography></Grid>
            <Grid item xs={6}><Typography variant='button' component='div'>{user?.roles}</Typography></Grid>

            <Grid item xs={6}><Typography variant='button' component='div'>User's Status</Typography></Grid>
            <Grid item xs={6}><Typography variant='button' component='div'>{user?.blocked?'Blocked':'Active'}</Typography></Grid>

            </Grid>

            <Divider/>

            <Grid container sx={{alignItems:'center', mt:3}}>

            <Grid item xs={6}><Typography variant='button' component='div'>Change User's Status</Typography></Grid>

            <Grid item xs={6}>
                <FormControl sx={{width:'100%'}}>
                    <InputLabel id='status'>Status</InputLabel>
                    <Select required
                            labelId='status'
                            id='status'
                            value={blocked}
                            label='Status'
                            onChange={(e=>setBlocked(e.target.value))}>

                                <MenuItem value='true'>Block</MenuItem>
                                <MenuItem value='false'>Active</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            </Grid>

            <Grid container sx={{alignItems:'center', mt:3}}>

            <Grid item xs={6}><Typography variant='button' component='div'>Change User's Role</Typography></Grid>

            <Grid item xs={6}>
                <FormControl sx={{width:'100%'}}>
                    <InputLabel id='status'>Role</InputLabel>
                    <Select required
                            labelId='role'
                            id='role'
                            value={role || ''}
                            label='Role'
                            onChange={(e=>setRole(e.target.value))}>

                                <MenuItem value='admin'>Admin</MenuItem>
                                <MenuItem value='seller'>Seller</MenuItem>
                                <MenuItem value='user'>User</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            </Grid>

            {role==='seller' || role.includes('seller') ?
            <Grid container sx={{alignItems:'center', mt:3}}>

            <Grid item xs={6}><Typography variant='button' component='div'>Select Store</Typography></Grid>

            <Grid item xs={6}>
                <FormControl sx={{width:'100%'}}>
                    <InputLabel id='status'>Select Store</InputLabel>
                    <Select required
                            labelId='store'
                            id='store'
                            value={store || ''}
                            label='Store'
                            onChange={(e=>setStore(e.target.value))}>
                                {stores && stores.map((st)=>
                                    <MenuItem value={st._id} key={st._id}>{st.title}</MenuItem>
                                )}
                                
                    </Select>
                </FormControl>
            </Grid>

            </Grid>
            :''}
            <Button variant='contained'
                    fullWidth
                    startIcon={<UpdateIcon/>}
                    sx={{mt:3,mb:2}}
                    onClick={submitHandler}>Change
            </Button>
        </Box>
    </Box>
  )
}

export default UpdateRole