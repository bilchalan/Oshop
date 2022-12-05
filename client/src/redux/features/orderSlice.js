import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import axiosPrivate from '../axiosPrivate';

export const createOrder=createAsyncThunk('order/createOrder', async({order,toast},{rejectWithValue})=>
{
    try{
        const {data}= await axiosPrivate.post('/orders',order);
        toast.success('Payment successfully completed.');
        return data.success;
    }catch(error){
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
export const getMyOrders=createAsyncThunk('order/getMyOrders', async({toast},{rejectWithValue})=>
{
    try{
        const {data}= await axiosPrivate.get('/orders');
        return data;
    }catch(error){
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
export const getOrderDetails=createAsyncThunk('order/getOrderDetails', async({id,toast},{rejectWithValue})=>
{
    try{
        const {data}= await axiosPrivate.get(`/orders/${id}`);
        return data;
    }catch(error){
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
export const getAllOrders=createAsyncThunk('order/getAllOrders', async({toast},{rejectWithValue})=>
{
    try{
        const {data}= await axiosPrivate.get('/authorized/orders');
        return data;
    }catch(error){
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const deleteOrder=createAsyncThunk('order/deleteOrder', async({id,toast},{rejectWithValue})=>
{
    try{
        const {data}= await axiosPrivate.delete(`/authorized/orders/${id}`);
        toast.success('Order deleted.')
        return data;
    }catch(error){
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
export const updateOrder=createAsyncThunk('order/updateOrder', async({id,jsonData,toast},{rejectWithValue})=>
{
    try{
        const {data}= await axiosPrivate.put(`/authorized/orders/${id}`,jsonData);
        toast.success('Order updated.')
        return data;
    }catch(error){
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

const orderSlice=createSlice({
    name:'order',
    initialState:{
        mutationResult:{success:false},
        orderlist:{orders:[]},
        orderDetails:{order:{}},
    },
    reducers:{
        resetMutationResult:(state)=>{
            state.mutationResult.success=false;
        }
    },
    extraReducers:{
        //create order
        [createOrder.pending]:(state,action)=>{
            state.mutationResult.loading=true;
        },
        [createOrder.fulfilled]:(state,action)=>{
            state.mutationResult.loading=false;
            state.mutationResult.success=action.payload;
        },
        [createOrder.rejected]:(state,action)=>{
            state.mutationResult.loading=false;
            state.mutationResult.error=action.payload;
        },
        //get my orders
        [getMyOrders.pending]:(state,action)=>{
            state.orderlist.loading=true;
        },
        [getMyOrders.fulfilled]:(state,action)=>{
            state.orderlist.loading=false;
            state.orderlist.orders=action.payload.orders;
        },
        [getMyOrders.rejected]:(state,action)=>{
            state.orderlist.loading=false;
            state.orderlist.error=action.payload;
        },
        //order details
        [getOrderDetails.pending]:(state,action)=>{
            state.orderDetails.loading=true;
        },
        [getOrderDetails.fulfilled]:(state,action)=>{
            state.orderDetails.loading=false;
            state.orderDetails.order=action.payload.order;
        },
        [getOrderDetails.rejected]:(state,action)=>{
            state.orderDetails.loading=false;
            state.orderDetails.error=action.payload;
        },
        //get all orders by authorised role
        [getAllOrders.pending]:(state,action)=>{
            state.orderlist.loading=true;
        },
        [getAllOrders.fulfilled]:(state,action)=>{
            state.orderlist.loading=false;
            state.orderlist.orders=action.payload.orders;
        },
        [getAllOrders.rejected]:(state,action)=>{
            state.orderlist.loading=false;
            state.orderlist.error=action.payload;
        },
        //delete an order
        [deleteOrder.pending]:(state,action)=>{
            state.mutationResult.loading=true;
        },
        [deleteOrder.fulfilled]:(state,action)=>{
            state.mutationResult.loading=false;
            state.mutationResult.success=action.payload;
        },
        [deleteOrder.rejected]:(state,action)=>{
            state.mutationResult.loading=false;
            state.mutationResult.error=action.payload;
        },
                //delete an order
                [updateOrder.pending]:(state,action)=>{
                    state.mutationResult.loading=true;
                },
                [updateOrder.fulfilled]:(state,action)=>{
                    state.mutationResult.loading=false;
                    state.mutationResult.success=action.payload;
                },
                [updateOrder.rejected]:(state,action)=>{
                    state.mutationResult.loading=false;
                    state.mutationResult.error=action.payload;
                },
    }
});
export const selectOrderMutationResult=(state)=>state.order.mutationResult;
export const selectAllOrders=(state)=>state.order.orderlist;
export const selectOrderDetails=(state)=>state.order.orderDetails;
export const {resetMutationResult} =orderSlice.actions;
export default orderSlice.reducer;