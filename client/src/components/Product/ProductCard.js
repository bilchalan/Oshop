import React,{useEffect,useState} from 'react';
import { IMAGE_BASEURL } from '../../constants/baseURL';
import {formatCurrency} from '../../utility/formatCurrency';
import {useDispatch,useSelector} from 'react-redux';
import {toast} from 'react-toastify';
import {useNavigate} from 'react-router-dom';


import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, Box, Stack, Rating } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';

import {addItemsToCart,selectCartItems, removeItem} from '../../redux/features/cartSlice';


const ProductCard = React.forwardRef(({product},ref) => {
  const dispatch=useDispatch();
  const [exist,setExist]=useState(false);
  const [color,setColor]=useState('info');
  const [icon,setIcon]=useState(<AddShoppingCartIcon/>);
  const [text,setText]=useState('Add to cart');

  const {products}=useSelector(selectCartItems);

  const remove=()=>{
    setExist(true);
    setColor('error');
    setIcon(<DeleteIcon/>);
    setText('Remove from cart');
  }

  const add=()=>{
    setExist(false);
    setColor('info');
    setIcon(<AddShoppingCartIcon/>);
    setText('Add to cart');
  }

  const cartHandler=()=>{
    const _id=product._id;
    const quantity=1;

    if(exist){
      dispatch(removeItem(_id));
      toast.error('Item remove from cart');
      add();
      return;
    }
    if(!exist){
      dispatch(addItemsToCart({_id,quantity,toast}))
      toast.success('Item added to cart');
      remove();
      return;
    }
    
  }

  const getExist=()=>{
    if(products){
      const e=products.some(p=>p._id===product._id);
      if(e===true){
        remove();
      }
    }
  }
  useEffect(() => {
    getExist();
  }, [])
  const navigate=useNavigate();
  const linkToDetails=()=>{navigate(`/product/${product._id}`);}
  
  return (
    <Box className='productCard'>
    
      <CardActionArea>
      <Card className='box-shadow' 
            onClick={linkToDetails}
            sx={{position:'relative',overflow:'hidden', minHeight:'365px'}}>
        <CardMedia
          component="img"
          height="140"
          image={IMAGE_BASEURL+product.images[0].url}
          alt={product.title}
        />
        {product.discount>0?
        <Typography variant='button' display='block' className='sale'>Sale</Typography>
        :
        ''}
        <CardContent>
            <Typography gutterBottom
                        variant='button'
                        component='h1'>{product?.title.length>15?product.title.slice(0,14):product.title}
            </Typography>
            <Stack spacing={1} sx={{display:'block'}}>
                <Rating name="half-rating-read" value={product.ratings} precision={0.1} readOnly />
            </Stack>
            <Typography gutterBottom
                        sx={{display:'block'}}
                        variant='caption'
                        component='span'>Reviews : ({product.numOfReviews})
            </Typography>
            {product.discount>0 ?
                <Box>
                    <Typography sx={{display:'block', textDecoration:'line-through',color:'red'}}
                                variant='caption'>Price : ({formatCurrency(product.price)})
                    </Typography>
                    <Typography sx={{display:'block'}}
                                variant='caption'>Price : ({formatCurrency(product.price-product.discount)})
                    </Typography>                   
                </Box>
            :
                <Typography sx={{display:'block'}}
                    variant='caption'>Price : {formatCurrency(product.price)}
                </Typography>       
            }
            {
                product.localShipmentPolicy==='free' ?
                <Box sx={{display:'flex', justifyContent:'center',alignItems:'center'}}>
                    <LocalShippingIcon sx={{mr:1, color:'#9c27b0'}} />
                    <Typography variant='caption'>Free Shipping</Typography>                
                </Box>
                :
                ''
            }
              <Typography sx={{display:'block'}}
                          variant='button'>View details &#38; buy.
              </Typography>

        </CardContent>
        </Card>
      </CardActionArea>
      <Box sx={{mt:2}}>
            {ref? 
                <Button variant='outlined'
                        ref={ref}
                        fullWidth
                        color={color}
                        startIcon={icon}
                        onClick={cartHandler}>{text}</Button>
            :
              <Button variant='outlined'
                        fullWidth
                        color={color}
                        startIcon={icon}
                        onClick={cartHandler}>{text}</Button>
            }
      </Box>
    </Box>
  )
})

export default ProductCard