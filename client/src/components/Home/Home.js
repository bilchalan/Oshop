import React,{useEffect,useState} from 'react'
import {useDispatch,useSelector} from 'react-redux';
import {toast} from 'react-toastify';
import {axiosPublic} from '../../redux/axiosPublic';
import ProductCard from '../Product/ProductCard';
import {getCategories, selectAllCategories} from '../../redux/features/categorySlice';

import {Box, Typography} from '@mui/material';

const Home = () => {
    const limit=4;
    const dispatch=useDispatch();
    const {categories}=useSelector(selectAllCategories);
 
    useEffect(() => {
      dispatch(getCategories({toast}));
    }, [dispatch]);
    
    const [topRatedProduct,setTopRatedProduct]=useState();
    useEffect(() => {
      const getProducts=async()=>{
        try{
            const response=await axiosPublic.get(`/products?&limit=${limit}&sort_by_ratings=${true}`)
            setTopRatedProduct(response.data);
        }catch(error){
            console.log(error);
        }
      }
      getProducts();
    }, [])

    const [categoryProducts,setCategoryProducts]=useState([]);
    const [catProductsLoading,setCatProductsLoading]=useState(false);

    useEffect(() => {
      if(categories){
        setCatProductsLoading(true);
        const getProducts=async()=>{
            try{
                const response=categories.map(async (category)=>
                    await axiosPublic.get(`/products?&limit=${limit}&category=${category._id}`))
                    Promise.all(response).then((values)=>{
                        setCategoryProducts([...categoryProducts,...values.map(value=>value.data)])
                    })
            }catch(error){
                console.log(error);
                setCatProductsLoading(false);
            }finally{
                setCatProductsLoading(false);
            }
        }
        getProducts();
      }
    }, [categories,catProductsLoading]);
    
    
  return (
    <Box className='container'>
        <Typography variant='div'
                    component='h3'
                    sx={{m:1,p:1,background:'#1976D5',color:'#fff',textShadow:'1px 1px 1px #555'}}>
                        Top rated products : 
        </Typography>
        <Box className='card-container'>
            {topRatedProduct && topRatedProduct?.products.map(product=>(
                <ProductCard product={product} key={product._id}/>
            ))}
        </Box>

        {categories && categories.map((cat,i)=>
        <Box key={cat._id}>
            <Typography variant='div'
                    component='h3'
                    sx={{m:1,p:1,background:'#1976D5',color:'#fff',textShadow:'1px 1px 1px #555'}}>
                        {cat.title} 
            </Typography>
            <Box className='card-container'>
                {categoryProducts && categoryProducts[i]?.products.map(product=>
                    <ProductCard product={product} key={product._id}/>
                )}
            </Box>
        </Box>
        )}

    </Box>
  )
}

export default Home