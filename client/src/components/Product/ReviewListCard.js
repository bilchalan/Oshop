import React from 'react';
import {Box,Stack, Rating, Typography,Avatar } from '@mui/material';
import { IMAGE_BASEURL } from '../../constants/baseURL';

const ReviewListCard = ({review}) => {
  return (
    <>
    <Box sx={{m:'0 auto', mt:2, display:'flex', flexDirection:'column',alignItems:'center',padding:2,
                    border:'1px solid #dadada', width:'90%'}}>
        <Avatar style={{height:80,width:80}}>
            <img src={IMAGE_BASEURL+review.user.avatar.url} alt={review.user.name} style={{height:80,width:80}}/>
        </Avatar>
        <Typography>{review.user.name}</Typography>
        <Stack spacing={1} sx={{display:'block'}}>
                <Rating value={review.rating} 
                        precision={0.1} 
                        readOnly
                />
        </Stack>
        <Typography>{review.comment}</Typography>
    </Box>
    </>
  )
}

export default ReviewListCard