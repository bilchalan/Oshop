import React,{useEffect,useState} from 'react';
import {useDispatch,useSelector} from 'react-redux';
import {toast} from 'react-toastify';

import {Typography,Box,Pagination,Stack,Accordion,AccordionSummary,AccordionDetails,TextField,Slider,List, ListItemButton,ListItemText } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterAltIcon from '@mui/icons-material/FilterAlt';


import {selectAllProducts,getProducts} from '../../redux/features/productSlice';
import {getCategories,selectAllCategories} from '../../redux/features/categorySlice';
import './Product.css';
import ProductCard from './ProductCard';
import ProductCardSkeleton from '../Skeletons/ProductCardSkeleton';
import HeadingWaveSkeleton from '../Skeletons/HeadingWaveSkeleton';

const Products = () => {
    const dispatch=useDispatch();
    const [currentPage,setCurrentPage]=useState(1);
    const [search,setSearch]=useState('');
    let minPrice=1;
    let maxPrice=50000;
    const [priceRange,setPriceRange]=useState([minPrice,maxPrice]);
    const [ratingsfilter,setRatingsFilter]=useState(0);
    const [category,setCategory]=useState('')
    const [selectedIndex, setSelectedIndex] = useState(0);
    const handleSearch=(e)=>{
      setSearch(e.target.value);
      setCurrentPage(1);
    }
    const priceHandler=(e,newPriceRange)=>{
      setPriceRange(newPriceRange);
      setCurrentPage(1);
    }
    const ratingHandler=(e)=>{
      setRatingsFilter(e.target.value);
      setCurrentPage(1);
    }
    const handleListItemClick = (event, index,id) => {
        setSelectedIndex(index);
        setCategory(id);
        setCurrentPage(1);
    };

    const {loading, products, filteredProductsCount,resultPerPage}=useSelector(selectAllProducts);
    const {categories}=useSelector(selectAllCategories);
    useEffect(() => {
      dispatch(getCategories({toast}));
      dispatch(getProducts({search,currentPage,priceRange,category,ratingsfilter,toast}));
    }, [dispatch,search,currentPage,priceRange,category,ratingsfilter])
    
  return (
    <Box className='wrapper'>
        <Box className='filter-box'>
        <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography sx={{display:'flex'}}><FilterAltIcon/>Filter products</Typography>
        </AccordionSummary>
        <AccordionDetails>

        <Box className='search-filter-box'>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography sx={{display:'flex'}}>Search products</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField type='text'
                          id='search'
                          label='Search'
                          name='search'
                          margin='normal'
                          fullWidth
                          value={search}
                          onChange={handleSearch}
              />
          </AccordionDetails>
        </Accordion>
        </Box>

        <Box className='price-filter-box'>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography sx={{display:'flex'}}>By price</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Slider
              value={priceRange}
              min={minPrice}
              step={1000}
              max={maxPrice}
              onChange={(e,newPriceRange)=>priceHandler(e,newPriceRange)}
              valueLabelDisplay="on"
            />
          </AccordionDetails>
        </Accordion>
        </Box>

        <Box className='rating-filter-box'>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography sx={{display:'flex'}}>By rating</Typography>
          </AccordionSummary>
          <AccordionDetails>
          <Slider
              defaultValue={0}
              min={0}
              step={.1}
              max={5}
              onChange={ratingHandler}
              valueLabelDisplay="on"
            />
          </AccordionDetails>
        </Accordion>
        </Box>

        <Box className='category-filter-box'>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography sx={{display:'flex'}}>By categories</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List component="nav" aria-label="main mailbox folders">

            <ListItemButton
                          key={0}
                          id={0}
                          selected={selectedIndex === 0}
                          onClick={(event) => handleListItemClick(event, 0, '')}>
              <ListItemText primary="All" />
            </ListItemButton>   

            {categories && categories.map((cat,index)=>  

            <ListItemButton
                          key={cat._id}
                          id={cat._id}
                          selected={selectedIndex === index+1}
                          onClick={(event) => handleListItemClick(event, index+1, cat._id)}>
              <ListItemText primary={cat.title} />
            </ListItemButton>           

            )}

            </List>

          </AccordionDetails>
        </Accordion>
        </Box>



        </AccordionDetails>
        </Accordion>

        </Box>

        <Box className='container'>
          {loading && loading ? <HeadingWaveSkeleton/>:
            <Typography variant='div'
                        component='h5'
                        sx={{ml:'10px',mb:'20px',textAlign:'left'}}
            >
              {filteredProductsCount && filteredProductsCount>0 ? 
              `Found ${filteredProductsCount} items`
              :
              'No product found'}
            </Typography>
          }


            <Box className='card-container'>
                {products && products.map((product,index)=>
                    <ProductCard product={product} key={product._id}/>
                )}
            </Box>

            {loading && 
              <Box className='card-container'>
                  {[...Array(8)].map((e,i)=>(<ProductCardSkeleton key={i}/>))}
              </Box>
            }
          <Stack spacing={2}>            
            <Pagination count={Math.ceil(filteredProductsCount/resultPerPage)} page={currentPage} onChange={((e,v)=>setCurrentPage(v))}  color="primary"  showFirstButton showLastButton />
          </Stack>
        </Box>
    </Box>
  )
}

export default Products