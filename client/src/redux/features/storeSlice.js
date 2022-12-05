import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {axiosPublic} from '../axiosPublic';
import axiosPrivate from '../axiosPrivate';

export const addStore=createAsyncThunk('store/addStore',async({formData,toast},{rejectWithValue})=>{
    try{
        const {data}=await axiosPrivate.post(`/stores`,formData,{headers:{'Content-type':'multipart/form-data'}});
        toast.success('Successfully added new store.');
        return data;

    }catch(error){
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
export const getStores=createAsyncThunk('store/getStores',async({toast},{rejectWithValue})=>{
    try{
        const {data}=await axiosPrivate.get(`/stores`);
        return data;

    }catch(error){
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const deleteStore=createAsyncThunk('store/deleteStore',async({id,toast},{rejectWithValue})=>{
    try{
        const {data}=await axiosPrivate.delete(`/stores/${id}`);
        return data;

    }catch(error){
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const storeDetails=createAsyncThunk('store/storeDetails',async({id,toast},{rejectWithValue})=>{
    try{
        const {data}=await axiosPrivate.get(`/stores/${id}`);
        return data;

    }catch(error){
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const updateStore=createAsyncThunk('store/updateStore',async({id,formData,toast},{rejectWithValue})=>{
    try{
        const {data}=await axiosPrivate.put(`/stores/${id}`,formData,{headers:{'Content-type':'multipart/form-data'}});
        toast.success('Store updated.')
        return data;
    }catch(error){
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
const storeSlice=createSlice({
    name:'store',
    initialState:{
        mutationResult:{success:false},
        storelist:{},
        storeDetails:{}
    },
    reducers:{
        resetMutationResult:(state)=>{
            state.mutationResult.success=false;
        }
    },
    extraReducers:{
        //add new store
        [addStore.pending]:(state,action)=>{
            state.mutationResult.loading=true;
        },
        [addStore.fulfilled]:(state,action)=>{
            state.mutationResult.loading=false;
            state.mutationResult.success=action.payload.success;
        },
        [addStore.rejected]:(state,action)=>{
            state.mutationResult.loading=false;
            state.mutationResult.error=action.payload;
        },
        // get all store list
        [getStores.pending]:(state,action)=>{
            state.storelist.loading=true;
        },
        [getStores.fulfilled]:(state,action)=>{
            state.storelist.loading=false;
            state.storelist.stores=action.payload.stores;
        },
        [getStores.rejected]:(state,action)=>{
            state.storelist.loading=false;
            state.storelist.error=action.payload;
        },
        //delete a store
        [deleteStore.pending]:(state,action)=>{
            state.mutationResult.loading=true;
        },
        [deleteStore.fulfilled]:(state,action)=>{
            state.mutationResult.loading=false;
            state.mutationResult.success=action.payload.success;
        },
        [deleteStore.rejected]:(state,action)=>{
            state.mutationResult.loading=false;
            state.mutationResult.error=action.payload;
        },
        //get store details
        [storeDetails.pending]:(state,action)=>{
            state.storeDetails.loading=true;
        },
        [storeDetails.fulfilled]:(state,action)=>{
            state.storeDetails.loading=false;
            state.storeDetails.store=action.payload.store;
        },
        [storeDetails.rejected]:(state,action)=>{
            state.storeDetails.loading=false;
            state.storeDetails.error=action.payload;
        },
        //update store
        [updateStore.pending]:(state,action)=>{
            state.mutationResult.loading=true;
        },
        [updateStore.fulfilled]:(state,action)=>{
            state.mutationResult.loading=false;
            state.mutationResult.success=action.payload.success;
        },
        [updateStore.rejected]:(state,action)=>{
            state.mutationResult.loading=false;
            state.mutationResult.error=action.payload;
        },
    }
})

export const selectStoreMutationResult=(state)=>state.store.mutationResult;
export const selectAllStores=(state)=>state.store.storelist;
export const selectStoreDetails=(state)=>state.store.storeDetails;
export const {resetMutationResult} =storeSlice.actions;

export default storeSlice.reducer;