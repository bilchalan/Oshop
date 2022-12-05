import React,{useState} from 'react';
import {useDispatch,useSelector} from 'react-redux';
import { CountryDropdown, RegionDropdown} from 'react-country-region-selector';
import {useNavigate} from 'react-router-dom';

import {selectShippingInfo,saveShippingInfo} from '../../redux/features/shippingSlice';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';


import {Box, Typography, TextField, Button, TextareaAutosize, Grid, Avatar} from '@mui/material';

const Shipping = () => {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const {shipInfo}=useSelector(selectShippingInfo);

    const [address,setAddress]=useState(shipInfo.address || '');
    const [city,setCity]=useState(shipInfo.city || '');
    const [zipCode,setZipCode]=useState(shipInfo.zipCode || '');
    const [state,setState]=useState(shipInfo.state || '');
    const [country,setCountry]=useState(shipInfo.country || '');
    const [phone,setPhone]=useState(shipInfo.phone || '');

    const handleSubmit=(e)=>{
        e.preventDefault();
        dispatch(saveShippingInfo({address,phone,city,zipCode,state,country}));
        navigate('/confirm-order');
    }
  return (
    <Box sx={{m:'0 auto',marginTop:2,textAlign:'center', maxWidth:'550px'}}>
        <LocationOnIcon sx={{width:100,height:100,color:'#1976d2'}}/>
        <Typography component='div' variant='h5'>Shipping Information</Typography>
        <Box component='form' onSubmit={handleSubmit} sx={{p:1}}>
            <TextareaAutosize required
                              aria-label='address'
                              minRows={5}
                              placeholder='Address'
                              value={address}
                              style={{width:'100%',marginTop:'16px'}}
                              onChange={(e=>setAddress(e.target.value))}
            />
            <TextField type='text'
                          id='phone'
                          label='Phone'
                          name='phone'
                          margin='normal'
                          required
                          fullWidth
                          value={phone}
                          onChange={(e=>setPhone(e.target.value))}
            /> 
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField type='text'
                          id='city'
                          label='City'
                          name='city'
                          margin='normal'
                          required
                          fullWidth
                          value={city}
                          onChange={(e=>setCity(e.target.value))}
                />
              </Grid>
              <Grid item xs={6}>
                    <TextField type='text'
                          id='zipCode'
                          label='Zip'
                          name='zipCode'
                          margin='normal'
                          required
                          fullWidth
                          value={zipCode}
                          onChange={(e=>setZipCode(e.target.value))}
                />               
                </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <CountryDropdown classes='ship-drop-down'
                                  defaultOptionLabel='Select a coutry'
                                  style={{width:'100%'}}
                                  value={country}
                                  valueType='short'
                                  priorityOptions={['CA','US','IN','GB']}
                                  onChange={(e=>setCountry(e))}
                />
              </Grid>
              <Grid item xs={6}>
                <RegionDropdown classes='ship-drop-down'
                                  defaultOptionLabel='Now select a region'
                                  blankOptionLabel='No country selected'
                                  style={{width:'100%'}}
                                  value={state}
                                  country={country}
                                  countryValueType='short'
                                  onChange={(e=>setState(e))}
                />              
                </Grid>
            </Grid>

            <Button type='submit'
                    variant='contained'
                    startIcon={<LocalShippingIcon/>}
                    sx={{m:4}}>
                Continue
            </Button>


        </Box>
    </Box>
    
  )
}

export default Shipping