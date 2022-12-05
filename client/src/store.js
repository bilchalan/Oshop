import {configureStore} from '@reduxjs/toolkit';
import AuthReducer from './redux/features/authSlice';
import BrandReducer from './redux/features/brandSlice';
import CategoryReducer from './redux/features/categorySlice';
import StoreReducer from './redux/features/storeSlice';
import ProductReducer from './redux/features/productSlice';
import CartReducer from './redux/features/cartSlice';
import ReviewReducer from './redux/features/reviewSlice';
import ShippingReducer from './redux/features/shippingSlice';
import OrderReducer from './redux/features/orderSlice';

export default configureStore({
    reducer:{
        auth:AuthReducer,
        brand:BrandReducer,
        category:CategoryReducer,
        store:StoreReducer,
        product:ProductReducer,
        cart:CartReducer,
        review:ReviewReducer,
        shipping:ShippingReducer,
        order:OrderReducer,
    }
})