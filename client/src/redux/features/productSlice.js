import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {axiosPublic} from '../axiosPublic';
import axiosPrivate from '../axiosPrivate';

export const getProducts=createAsyncThunk('product/getProducts',async({search,currentPage,priceRange,category,ratingsfilter,toast},{rejectWithValue})=>{
    try{
        let key='keyword='+search;
        let page='&page='+currentPage;
        let price='&price[gte]='+priceRange[0]+'&price[lte]='+priceRange[1];
        let cat=null;
        if(category){
            cat='&category='+category;
        }else{
            cat='';
        }
        let ratings='';
        if(ratingsfilter>0 || ratingsfilter!=='undefined'){
            ratings='&ratings[gte]='+ratingsfilter;
        }

        let productParams=key+page+price+cat+ratings;

        const {data}=await axiosPrivate.get(`/products?${productParams}`);
        return data;

    }catch(error){
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const addProduct=createAsyncThunk('product/addProduct',async({formData,toast},{rejectWithValue})=>{
    try{
        const {data}=await axiosPrivate.post(`/products`,formData,{headers:{'Content-type':'multipart/form-data'}});
        toast.success('Successfully added new product.');
        return data;

    }catch(error){
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
export const getProductsByAuthorizeRoles=createAsyncThunk('product/getProductsByAuthorizeRoles',async({toast},{rejectWithValue})=>{
    try{
        const {data}=await axiosPrivate.get(`/athorized/products`);
        return data;

    }catch(error){
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const deleteProduct=createAsyncThunk('product/deleteProduct',async({id,toast},{rejectWithValue})=>{
    try{
        const {data}=await axiosPrivate.delete(`/products/${id}`);
        return data;

    }catch(error){
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const productDetails=createAsyncThunk('product/productDetails',async({id,toast},{rejectWithValue})=>{
    try{
        const {data}=await axiosPublic.get(`/products/${id}`);
        return data;

    }catch(error){
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const updateProduct=createAsyncThunk('product/updateProduct',async({id,formData,toast},{rejectWithValue})=>{
    try{
        const {data}=await axiosPrivate.put(`/products/${id}`,formData,{headers:{'Content-type':'multipart/form-data'}});
        toast.success('Product updated.')
        return data;
    }catch(error){
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
const productSlice=createSlice({
    name:'product',
    initialState:{
        mutationResult:{success:false},
        productlist:{products:[]},
        productDetails:{}
    },
    reducers:{
        resetMutationResult:(state)=>{
            state.mutationResult.success=false;
        },
        resetProducts:(state)=>{
            state.productlist.products=[];
        }
    },
    extraReducers:{
        // get all product list fro all
        [getProducts.pending]:(state,action)=>{
            state.productlist.loading=true;
        },
        [getProducts.fulfilled]:(state,action)=>{
            state.productlist.loading=false;
            state.productlist.products=[...state.productlist.products,...action.payload.products];
            state.productlist.productCount=action.payload.productCount;
            state.productlist.resultPerPage=action.payload.resultPerPage;
            state.productlist.filteredProductsCount=action.payload.filteredProductsCount;
        },
        [getProducts.rejected]:(state,action)=>{
            state.productlist.loading=false;
            state.productlist.error=action.payload;
        },
        //add new product
        [addProduct.pending]:(state,action)=>{
            state.mutationResult.loading=true;
        },
        [addProduct.fulfilled]:(state,action)=>{
            state.mutationResult.loading=false;
            state.mutationResult.success=action.payload.success;
        },
        [addProduct.rejected]:(state,action)=>{
            state.mutationResult.loading=false;
            state.mutationResult.error=action.payload;
        },
        // get all product list
        [getProductsByAuthorizeRoles.pending]:(state,action)=>{
            state.productlist.loading=true;
        },
        [getProductsByAuthorizeRoles.fulfilled]:(state,action)=>{
            state.productlist.loading=false;
            state.productlist.products=action.payload.products;
        },
        [getProductsByAuthorizeRoles.rejected]:(state,action)=>{
            state.productlist.loading=false;
            state.productlist.error=action.payload;
        },
        //delete a product
        [deleteProduct.pending]:(state,action)=>{
            state.mutationResult.loading=true;
        },
        [deleteProduct.fulfilled]:(state,action)=>{
            state.mutationResult.loading=false;
            state.mutationResult.success=action.payload.success;
        },
        [deleteProduct.rejected]:(state,action)=>{
            state.mutationResult.loading=false;
            state.mutationResult.error=action.payload;
        },
        //get product details
        [productDetails.pending]:(state,action)=>{
            state.productDetails.loading=true;
        },
        [productDetails.fulfilled]:(state,action)=>{
            state.productDetails.loading=false;
            state.productDetails.product=action.payload.product;
        },
        [productDetails.rejected]:(state,action)=>{
            state.productDetails.loading=false;
            state.productDetails.error=action.payload;
        },
        //update product
        [updateProduct.pending]:(state,action)=>{
            state.mutationResult.loading=true;
        },
        [updateProduct.fulfilled]:(state,action)=>{
            state.mutationResult.loading=false;
            state.mutationResult.success=action.payload.success;
        },
        [updateProduct.rejected]:(state,action)=>{
            state.mutationResult.loading=false;
            state.mutationResult.error=action.payload;
        },
    }
})

export const selectProductMutationResult=(state)=>state.product.mutationResult;
export const selectAllProducts=(state)=>state.product.productlist;
export const selectProductDetails=(state)=>state.product.productDetails;
export const {resetMutationResult,resetProducts} =productSlice.actions;

export default productSlice.reducer;