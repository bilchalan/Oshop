import React from 'react';
import { IMAGE_BASEURL } from '../../constants/baseURL';
import {formatCurrency} from '../../utility/formatCurrency';

import { Button, Box, Typography, Card, CardMedia} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CartItemCard = ({item, deleteCartItems}) => {
  return (
    <Box className='item-details'>
        <Card sx={{display:'flex', width:'98%', boxShadow:0}}>
            <Box sx={{display:'flex'}}>
                <CardMedia component='img'
                        sx={{width:'150px', maxHeight:'120px'}}
                        image={IMAGE_BASEURL+item.image} alt={item.title}/>
            </Box>
            <Box sx={{display:'flex', flexDirection:'column',pl:1,pb:1}}>
                <Typography variant='button' display='block'>{item.title}</Typography>
                <Typography variant='button' display='block'>
                    Price:{formatCurrency(item.price)}
                </Typography>
                <Box sx={{display:'flex', alignItems:'center',}}>
                    <Button color='error'
                            variant='outlined'
                            startIcon={<DeleteIcon/>}
                            onClick={()=>deleteCartItems(item._id)}>
                            Remove
                    </Button>
                </Box>
            </Box>          
        </Card>
    </Box>
  )
}

export default CartItemCard