import React,{useEffect,useState} from 'react';
import {useDispatch,useSelector} from 'react-redux';
import {toast} from 'react-toastify';
import axiosPrivate from '../../redux/axiosPrivate';
import {useNavigate} from 'react-router-dom';

import {CardNumberElement,CardCvcElement, CardExpiryElement,useStripe,useElements} from '@stripe/react-stripe-js';

import {Box, Card, Avatar, Typography, Grid, Divider} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import PaymentIcon from '@mui/icons-material/Payment';

import {selectCartItems} from '../../redux/features/cartSlice';
import {selectShippingInfo} from '../../redux/features/shippingSlice';
import {selectLoggedInUser} from '../../redux/features/authSlice';
import jwtDecode from 'jwt-decode';
import {selectOrderMutationResult,createOrder,resetMutationResult} from '../../redux/features/orderSlice';
import {formatCurrency} from '../../utility/formatCurrency';


const StripeCheckoutForm = (props) => {
    const navigate=useNavigate();
    const dispatch=useDispatch()
    const stripe=useStripe();
    const elements=useElements();
    const [proccessing,setProcessing]=useState(false);
    const orderInfo=JSON.parse(sessionStorage.getItem('orderInfo'));
    const {shipInfo}=useSelector(selectShippingInfo);
    const {products}=useSelector(selectCartItems);
    const {user, accessToken}=useSelector(selectLoggedInUser);
    const {UserInfo}=jwtDecode(accessToken);
    const userEmail=UserInfo.email.toString();
    const {success}=useSelector(selectOrderMutationResult);
    const paymentData={
        amount:Math.round(orderInfo.totalPrice*100)
    }

    const orderItems=products.map(({_id,...rest})=>({...rest,product:_id}));

    const order={
        shippingInfo:shipInfo,
        orderItems:orderItems,
        itemsPrice:orderInfo.subTotal,
        taxPrice:orderInfo.tax,
        shippingPrice:orderInfo.shippingCharge,
        totalPrice:orderInfo.totalPrice

    }

    const submitHandler= async(e)=>{
        e.preventDefault();
        setProcessing(true);
        try{
            const {data}=await axiosPrivate.post(`/create-payment-intent`,paymentData);
            const client_secret=data.clientSecret;
            if(!stripe || !elements) return;

            const result=await stripe.confirmCardPayment(client_secret,{
                payment_method:{
                    card:elements.getElement(CardNumberElement),
                    billing_details:{
                        name:user.name,
                        email:userEmail,
                        address:{
                            line1:shipInfo.address,
                            city:shipInfo.city,
                            state:shipInfo.state,
                            postal_code:shipInfo.zipCode,
                            country:shipInfo.country
                        }
                    }
                }
            });

            if(result.error){
                toast.error(result.error.message);
                setProcessing(false);
            }else{
                if(result.paymentIntent.status==='succeeded'){
                    order.paymentInfo={
                        id:result.paymentIntent.id,
                        status:result.paymentIntent.status,
                    }
                    dispatch(createOrder({order,toast}));
                }else{
                    toast.error('Proccessing error');
                    setProcessing(false);
                }
            }

        }catch(error){
            toast.error(error.response.data.message);
            setProcessing(false);
        }
    }
    useEffect(() => {
      if(success){
        dispatch(resetMutationResult());
        setProcessing(false);
        navigate('/order/success');
      }
    }, [dispatch,success,navigate]);
    
  return (
    <Box component='form'
            onSubmit={(e)=>submitHandler(e)}
            sx={{m:'0 auto', maxWidth:'550px',textAlign:'center',minWidth:'500px'}}>
        <Card sx={{p:1,pt:3}}>
            <Avatar sx={{bgcolor:'primary.main',height:'80px',width:'80px',m:'0 auto'}}>
                <Typography sx={{fontSize:'1.3rem'}}>Stripe</Typography>
            </Avatar>
        
        <Divider sx={{m:'10px 0'}}/>
        <Box sx={{textAlign:'right'}}>
            <Grid container sx={{alignItems:'center',m:'20px 0'}}>
                <Grid item xs sx={{mr:1}}><Typography>Card Number : </Typography></Grid>
                <Grid item xs><CardNumberElement style={{border:'1px solid #dadada'}}/></Grid>
            </Grid>

            <Grid container sx={{alignItems:'center',m:'20px 0'}}>
                <Grid item xs sx={{mr:1}}><Typography>Card Expire Date : </Typography></Grid>
                <Grid item xs><CardExpiryElement style={{border:'1px solid #dadada'}}/></Grid>
            </Grid>

            <Grid container  sx={{alignItems:'center',m:'20px 0'}}>
                <Grid item xs sx={{mr:1}}><Typography>Card CVC : </Typography></Grid>
                <Grid item xs><CardCvcElement style={{border:'1px solid #dadada'}}/></Grid>
            </Grid>
        </Box>

        <LoadingButton type='submit'
                        loading={proccessing}
                        fullWidth
                        loadingPosition='start'
                        startIcon={<PaymentIcon/>}
                        variant='contained'>
                            Pay - {orderInfo && formatCurrency(orderInfo.totalPrice)}

        </LoadingButton>
        </Card>
    </Box>
  )
}

export default StripeCheckoutForm