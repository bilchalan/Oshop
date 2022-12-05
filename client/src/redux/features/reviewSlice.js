import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {axiosPublic} from '../axiosPublic';
import axiosPrivate from '../axiosPrivate';

export const newReview=createAsyncThunk('review/newReview',async({jsonData,toast},{rejectWithValue})=>{
    try{
        const {data}=await axiosPrivate.put(`/reviews`,jsonData);
        return data;

    }catch(error){
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
export const getReviews=createAsyncThunk('review/getReviews',async({id,toast},{rejectWithValue})=>{
    try{
        const {data}=await axiosPublic.get(`/reviews?id=${id}`);
        return data.reviews;

    }catch(error){
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const deleteReview=createAsyncThunk('review/deleteReview',async({reviewId,productId,toast},{rejectWithValue})=>{
    try{
        const {data}=await axiosPrivate.delete(`/reviews?id=${reviewId}&productId=${productId}`);
        toast.success('Review deleted.');
        return data;

    }catch(error){
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

const reviewSlice=createSlice({
    name:'review',
    initialState:{
        mutationResult:{success:false},
        reviewlist:{reviews:[]}
    },
    reducers:{
        resetMutationResult:(state)=>{
            state.mutationResult.success=false;
        }
    },
    extraReducers:{
        //add new review or edit
        [newReview.pending]:(state,action)=>{
            state.mutationResult.loading=true;
        },
        [newReview.fulfilled]:(state,action)=>{
            state.mutationResult.loading=false;
            state.mutationResult.success=action.payload.success;
        },
        [newReview.rejected]:(state,action)=>{
            state.mutationResult.loading=false;
            state.mutationResult.error=action.payload;
        },
        //get all reviews
        [getReviews.pending]:(state,action)=>{
            state.reviewlist.loading=true;
        },
        [getReviews.fulfilled]:(state,action)=>{
            state.reviewlist.loading=false;
            state.reviewlist.reviews=action.payload;
        },
        [getReviews.rejected]:(state,action)=>{
            state.reviewlist.loading=false;
            state.reviewlist.error=action.payload;
        },
        //delete a review
        [deleteReview.pending]:(state,action)=>{
            state.mutationResult.loading=true;
        },
        [deleteReview.fulfilled]:(state,action)=>{
            state.mutationResult.loading=false;
            state.mutationResult.success=action.payload.success;
        },
        [deleteReview.rejected]:(state,action)=>{
            state.mutationResult.loading=false;
            state.mutationResult.error=action.payload;
        },

    }
})

export const selectReviewMutationResult=(state)=>state.review.mutationResult;
export const selectAllReviews=(state)=>state.review.reviewlist;
export const {resetMutationResult} =reviewSlice.actions;

export default reviewSlice.reducer;