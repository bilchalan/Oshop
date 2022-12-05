import React,{useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useDispatch,useSelector} from 'react-redux'
import {selectProductDetails,productDetails} from '../../redux/features/productSlice';
import {toast} from 'react-toastify';
import BoxShadowLoader from '../Skeletons/BoxShadowLoader';
import ProductDetailsImageCarouselCard from './ProductDetailsImageCarouselCard';
import ProductDetailsInfoCard from './ProductDetailsInfoCard';
import './ProductDetails.css';
import { newReview,selectAllReviews,selectReviewMutationResult,resetMutationResult, getReviews } from '../../redux/features/reviewSlice';
import ReviewListCard from './ReviewListCard';

import {Box,Button, Dialog, DialogActions, DialogContent, DialogTitle, TextareaAutosize,Stack, Rating, Typography } from '@mui/material';

const ProductDetails = () => {
    const [submitRating,setSubmitRating]=useState(5);
    const [submitReview,setSubmitReview]=useState('');
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };
    const {id}=useParams();
    const dispatch=useDispatch();
    const {loading,product}=useSelector(selectProductDetails);
    const {reviews}=useSelector(selectAllReviews);
    const {success}=useSelector(selectReviewMutationResult);
    console.log(reviews);

    useEffect(() => {
        if(success){
            toast.success('Thank for your valuable review.');
            dispatch(resetMutationResult());
        }
      dispatch(productDetails({id,toast}));
      dispatch(getReviews({id,toast}));
    }, [dispatch,id,success]);
    
    const handleSubmitReviewRating=()=>{
            setOpen(false);

            const jsonData={
                rating:submitRating,
                comment:submitReview,
                productId:product._id
            }
            dispatch(newReview({jsonData,toast}));
    }
  return (
    <>
        {loading?<BoxShadowLoader/>:
            <>
                <Box className='product-details'>
                    <Box className='product-image-carousel'>
                        {product?.images && <ProductDetailsImageCarouselCard images={product.images}/>}
                    </Box>
                    <Box className='product-info'>
                        {product && <ProductDetailsInfoCard product={product}/>}
                    </Box>
                </Box>



                <Box className='product-reviews' style={{marginTop:'50px'}}>
                    <Box className='reviews' style={{textAlign:'center'}}>
                        <Button variant="outlined" onClick={handleClickOpen}>Submit Review</Button>
                        <Dialog open={open} onClose={handleClose}>
                            <DialogTitle sx={{bgcolor:'primary.main', color:'#fff',mb:2}}>Review &#38; Rating</DialogTitle>
                            <DialogContent sx={{minWidth:'350px'}} fullWidth>
                            <Stack spacing={1} sx={{display:'block'}}>
                                    <Rating value={submitRating} 
                                            precision={0.1} 
                                            onChange={((e,newValue)=>setSubmitRating(newValue))}
                                    />
                            </Stack>
                            <TextareaAutosize                            
                                id="review"
                                style={{width:'100%',margin:'10px 0',padding:0}}
                                minRows={5}
                                value={submitReview}
                                variant="standard"
                                onChange={(e=>setSubmitReview(e.target.value))}
                            />
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button onClick={handleSubmitReviewRating}>Submit</Button>
                            </DialogActions>
                        </Dialog>   

                        {product?.reviews && product.reviews[0] ? 
                        <Box className='review'>
                            {product?.reviews && product.reviews.map(review=>
                                <ReviewListCard review={review} />
                            )}
                        </Box>
                         :                        
                        <Typography variant='button'>No reviews yet</Typography>                        
                        }

                    </Box>                
                </Box>
            </>
        }
    </>
  )
}

export default ProductDetails