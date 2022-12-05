import React from 'react';
import {Skeleton,Card,Box} from '@mui/material';

const ProductCardSkeleton = () => {
  return (
    <Box className='productCard'>
        <Card sx={{minHeight:'365px'}} className='box-shadow'>
            <Skeleton variant='rectangular'
                        width='100%'
                        animation='wave'>
                            <Box sx={{pt:'140px'}}></Box>

            </Skeleton>
            <Box sx={{p:1}}>
                <Skeleton width='100%' animation='wave' height={60}/>
                <Skeleton width='70%' animation='wave' height={35} sx={{m:'0 auto'}}/>
                <Skeleton width='70%' animation='wave' height={35} sx={{m:'0 auto'}}/>
                <Skeleton width='100%' animation='wave' height={35}/>
                <Skeleton width='100%' animation='wave' height={35}/>
            </Box>
        </Card>
        <Skeleton width='100%' animation='wave' height={60} sx={{m:'0 auto',mt:2}}/>
    </Box>
  )
}

export default ProductCardSkeleton