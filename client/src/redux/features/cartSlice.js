import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import {axiosPublic} from '../axiosPublic';

export const addItemsToCart=createAsyncThunk('cart/addItemsToCart',async({_id,quantity,toast},{rejectWithValue})=>{
    try{
        const {data}=await axiosPublic.get(`/products/${_id}`);
        return{
            _id:data.product._id,
            title:data.product.title,
            price:data.product.price-data.product.discount,
            image:data.product.images[0].url,
            stock:data.product.stock,
            localShipmentPolicy:data.product.localShipmentPolicy,
            customLocalShipmentCost:data.product.localShipmentPolicy==='custom'?data.product.customLocalShipmentCost:'',
            internationalShipmentPolicy:data.product.internationalShipmentPolicy,
            customInternationalShipmentCost:data.product.internationalShipmentPolicy==='custom'?data.product.customInternationalShipmentCost:'',
            quantity
        }
    }
    catch(error){
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

const cartSlice=createSlice({
    name:'cart',
    initialState:{
        cartItems:{products:localStorage.getItem('products')?JSON.parse(localStorage.getItem('products')):[]},
    },
    reducers:{
        removeItem:(state,action)=>{
            const newItems=state.cartItems.products.filter((i)=>i._id !== action.payload);
            state.cartItems.products=newItems;
            localStorage.setItem('products',JSON.stringify(newItems));
        }
    },
    extraReducers:{
        //add new brand
        [addItemsToCart.pending]:(state,action)=>{
            state.cartItems.loading=true;
        },
        [addItemsToCart.fulfilled]:(state,action)=>{
            state.cartItems.loading=false;
            state.cartItems.success=true;

            const item=action.payload;
            if(Array.isArray(state.cartItems.products) && state.cartItems.products.length<1){
                state.cartItems.products=[item];
            }else{
                const isItemExist=state.cartItems.products.find(i=>i._id===item._id)
                if(isItemExist){
                    state.cartItems.products=state.cartItems.products.map(i=>i._id===isItemExist._id?item:i)
                }else{
                    state.cartItems.products=[...state.cartItems.products,item];
                }

            }
            localStorage.setItem('products',JSON.stringify(state.cartItems.products));
        },
        [addItemsToCart.rejected]:(state,action)=>{
            state.cartItems.loading=false;
            state.cartItems.success=false;
            state.cartItems.error=action.payload;
        },
    }
})

export const selectCartItems=(state)=>state.cart.cartItems;
export const {removeItem}=cartSlice.actions;
export default cartSlice.reducer;