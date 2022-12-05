import React,{useState,useEffect} from 'react'
import {useDispatch,useSelector} from 'react-redux';
import {toast} from 'react-toastify';
import './Product.css';

import {Box, Typography, TextField, Button, TextareaAutosize, Grid,  MenuItem, FormControl, Select, InputLabel} from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import {styled} from '@mui/material/styles';
import CollectionsIcon from '@mui/icons-material/Collections';

import {getCategories,selectAllCategories} from '../../../redux/features/categorySlice';
import {getBrands,selectAllBrands} from '../../../redux/features/brandSlice';
import {getStores,selectAllStores} from '../../../redux/features/storeSlice';
import {addProduct,resetMutationResult,selectProductMutationResult} from '../../../redux/features/productSlice';
import {POLICIES} from '../../../constants/policies';
import gallery from '../../../images/gallery.png';
import galleryback from '../../../images/galleryback.png';


const AddNewProduct = () => {

    const Input=styled('input')({
      display:'none',
    })

    const InfoTooltip = styled(({ className, ...props }) => (
      <Tooltip {...props} arrow classes={{ popper: className }} />
    ))(({ theme }) => ({
      [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.common.black,
      },
      [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.black,
        padding:'10px 5px',
        maxWidth:220
      },
    }));

    const dispatch=useDispatch();
    const {loading,success}=useSelector(selectProductMutationResult);
    const {brands}=useSelector(selectAllBrands);
    const {categories}=useSelector(selectAllCategories);
    const {stores}=useSelector(selectAllStores);

    const [title,setTitle]=useState('');
    const [description,setDescription]=useState('');
    const [price,setPrice]=useState('');
    const [discount,setDiscount]=useState(0);
    const [weight,setWeight]=useState(0);
    const [stock,setStock]=useState(1);
    const [category,setCategory]=useState('');
    const [brand,setBrand]=useState('');
    const [store,setStore]=useState('');
    const [localShipmentPolicy,setLocalShipmentPolicy]=useState('standard');
    const [internationalShipmentPolicy,setInternationalShipmentPolicy]=useState('standard');
    const [customLocalShipmentCost,setCustomLocalShipmentCost]=useState('');
    const [customInternationalShipmentCost,setCustomInternationalShipmentCost]=useState('');

    const [images,setImages]=useState([]);
    const [productFiles,setProductFiles]=useState([]);



    const imageHandler=(e)=>{
        const files=Array.from(e.target.files);
        setProductFiles(e.target.files);
        setImages([]);

        files.forEach((file)=>{
          const reader=new FileReader();
          reader.onload=()=>{
            if(reader.readyState===2){
              setImages((old)=>[...old,reader.result])
            }
          }
          reader.readAsDataURL(file);
        })    
    }
    const handleSubmit=(e)=>{
        e.preventDefault();

        if(images.length<1){
          toast.error('Please select images.');
          return;
        }
        if((localShipmentPolicy==='custom') &&(customLocalShipmentCost<1)){
          toast.error('Please enter custom shipping cost');
          return;
        }
        if((internationalShipmentPolicy==='custom') &&(setCustomInternationalShipmentCost<1)){
          toast.error('Please enter custom shipping cost');
          return;
        }
        const formData=new FormData();
        formData.append('title',title);
        formData.append('description',description);
        formData.append('price',price);
        formData.append('discount',discount);
        formData.append('weight',weight);
        formData.append('stock',stock);
        formData.append('category',category);
        formData.append('brand',brand);
        formData.append('store',store);

        formData.append('localShipmentPolicy',localShipmentPolicy);
        formData.append('internationalShipmentPolicy',internationalShipmentPolicy);
        formData.append('customLocalShipmentCost',customLocalShipmentCost);
        formData.append('setCustomInternationalShipmentCost',setCustomInternationalShipmentCost);

        Object.keys(productFiles).forEach(key=>{
          formData.append(productFiles.item(key).name,productFiles.item(key));
        })
        dispatch(addProduct({formData,toast}));
    }

    useEffect(() => {
      dispatch(getBrands({toast}));
      dispatch(getCategories({toast}));
      dispatch(getStores({toast}));
    }, [dispatch]);
    
    useEffect(() => {
      
      if(success){
        dispatch(resetMutationResult());
        setTitle('');
        setDescription('');
        setPrice('');
        setDiscount(0);
        setWeight(0);
        setStock(1);
        setCategory('');
        setBrand('');
        setStore('');
        setLocalShipmentPolicy('standard');
        setInternationalShipmentPolicy('standard');
        setCustomLocalShipmentCost('');
        setCustomInternationalShipmentCost('');
        setImages([]);
        setProductFiles('');
      }
    }, [success, dispatch]);
    
  return (
    <Box sx={{m:'0 auto',marginTop:2, maxWidth:'550px'}}>
        <Typography component='div' variant='h5'sx={{textAlign:'center'}}>Add new product</Typography>
        <Box component='form' onSubmit={handleSubmit}>
            <TextField type='text'
                        id='title'
                        label='Title'
                        name='title'
                        margin='normal'
                        required
                        fullWidth
                        autoFocus
                        value={title}
                        onChange={(e=>setTitle(e.target.value))}
            />
            <TextareaAutosize required
                              aria-label='description'
                              minRows={5}
                              placeholder='Description'
                              value={description}
                              style={{width:'100%',marginTop:'16px'}}
                              onChange={(e=>setDescription(e.target.value))}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField type='number'
                          id='price'
                          label='Price'
                          name='price'
                          margin='normal'
                          required
                          fullWidth
                          value={price}
                          onChange={(e=>setPrice(e.target.value))}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField type='number'
                          id='discount'
                          label='Discount'
                          name='discount'
                          margin='normal'
                          required
                          fullWidth
                          value={discount}
                          onChange={(e=>setDiscount(e.target.value))}
                />               
                </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <InfoTooltip placement='right'
                              arrow
                              title='Weight in kg. Put weight if items weight exceed 5kg'>
                  <TextField type='number'
                          id='weight'
                          label='Weight'
                          name='weight'
                          margin='normal'
                          fullWidth
                          value={weight}
                          onChange={(e=>setWeight(e.target.value))}
                  />
                </InfoTooltip>
              </Grid>
              <Grid item xs={6}>
                <TextField type='number'
                          id='stock'
                          label='Stock'
                          name='stock'
                          margin='normal'
                          required
                          fullWidth
                          value={stock}
                          onChange={(e=>setStock(e.target.value))}
                />               
                </Grid>
            </Grid>

             <Grid container spacing={2} sx={{mt:'4px'}}>
              <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id='category'>Category</InputLabel>
                    <Select required
                            labelId='category'
                            id='category'
                            value={category}
                            label='Category'
                            onChange={(e=>setCategory(e.target.value))}>

                            {categories && categories.map((cat)=>
                              <MenuItem key={cat._id} value={cat._id}>{cat.title}</MenuItem>
                            )}
                    </Select>
                  </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                    <InputLabel id='brand'>Brand</InputLabel>
                    <Select required
                            labelId='brand'
                            id='brand'
                            value={brand}
                            label='Brand'
                            onChange={(e=>setBrand(e.target.value))}>

                            {brands && brands.map((brand)=>
                              <MenuItem key={brand._id} value={brand._id}>{brand.title}</MenuItem>
                            )}
                    </Select>
                  </FormControl>             
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{mt:'16px'}}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id='store'>Store</InputLabel>
                    <Select required
                            labelId='store'
                            id='store'
                            value={store}
                            label='Store'
                            onChange={(e=>setStore(e.target.value))}>

                            {stores && stores.map((store)=>
                              <MenuItem key={store._id} value={store._id}>{store.title}</MenuItem>
                            )}
                    </Select>
                  </FormControl>
              </Grid>
              <Grid item xs={6}>
               
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{mt:'16px'}}>
              <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id='localShipmentPolicy'>Local Shipment Policy</InputLabel>
                    <Select required
                            labelId='localShipmentPolicy'
                            id='localShipmentPolicy'
                            value={localShipmentPolicy}
                            label='Local Shipment Policy'
                            onChange={(e=>setLocalShipmentPolicy(e.target.value))}>

                            {POLICIES && POLICIES.map((policy)=>
                              <MenuItem key={policy.id} value={policy.type}>{policy.title}</MenuItem>
                            )}
                    </Select>
                  </FormControl>
              </Grid>
              <Grid item xs={6}>
              <FormControl fullWidth>
                    <InputLabel id='internationalShipmentPolicy'>International Shipment Policy</InputLabel>
                    <Select required
                            labelId='internationalShipmentPolicy'
                            id='internationalShipmentPolicy'
                            value={internationalShipmentPolicy}
                            label='International Shipment Policy'
                            onChange={(e=>setInternationalShipmentPolicy(e.target.value))}>

                            {POLICIES && POLICIES.map((policy)=>
                              <MenuItem key={policy.id} value={policy.type}>{policy.title}</MenuItem>
                            )}
                    </Select>
                  </FormControl>             
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                {localShipmentPolicy!=='custom'? '' :
                <TextField type='number'
                          id='customLocalShipmentCost'
                          label='Local Shipment Cost'
                          name='customLocalShipmentCost'
                          margin='normal'
                          fullWidth
                          value={customLocalShipmentCost}
                          onChange={(e=>setCustomLocalShipmentCost(e.target.value))}
                />
                }
              </Grid>
              <Grid item xs={6}>
                {internationalShipmentPolicy!=='custom'? '' :
                <TextField type='number'
                          id='customInternationalShipmentCost'
                          label='International Shipment Cost'
                          name='customInternationalShipmentCost'
                          margin='normal'
                          fullWidth
                          value={customInternationalShipmentCost}
                          onChange={(e=>setCustomInternationalShipmentCost(e.target.value))}
                /> 
                }              
                </Grid>
            </Grid>

            <Box>
                <label htmlFor='productImage'>
                  <Input  accept='imaage/*'
                          id='productImage'
                          multiple
                          type='file'
                          name='productImage'
                          onChange={imageHandler}
                  />
                  <Button type='button'
                              fullWidth
                              component='span'
                              variant='outlined'
                              startIcon={<CollectionsIcon/>}
                              sx={{m:'16px 0'}}
                  >Upload photo</Button>                  
                </label>
            </Box>
            {images.length>0?
              <Box className='galleryback'>
                {images.map((image,index)=>(
                  <img key={index} src={image} alt='product image' style={{maxWidth:90, maxHeight:80, padding:'0 5px'}} />
                ))}
              </Box>
            :
            <Box className='galleryback' style={{backgroundImage:`url("${galleryback}")`}}>
                <img src={gallery} alt='oshop nophoto'/>
            </Box>
            }



            <Button type='submit'
                        fullWidth
                        disabled={loading?true:false}
                        variant='contained'
                        startIcon={<AddBoxOutlinedIcon/>}
                        sx={{mt:3,mb:2}}
            >Add Product</Button>
        </Box>
    </Box>
  )
}

export default AddNewProduct