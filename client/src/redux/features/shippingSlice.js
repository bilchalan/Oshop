import {createSlice} from '@reduxjs/toolkit';

const shippingSlice=createSlice({
    name:'shipping',
    initialState:{
        shippingInfo:{shipInfo:localStorage.getItem('shipIfo')?JSON.parse(localStorage.getItem('shipInfo')):{}},
    },
    reducers:{
        saveShippingInfo:(state,action)=>{
            state.shippingInfo.shipInfo=action.payload;
            localStorage.setItem('shipInfo',JSON.stringify(state.shippingInfo.shipInfo));
        }
    }
})

export const selectShippingInfo=(state)=>state.shipping.shippingInfo;
export const {saveShippingInfo}=shippingSlice.actions;
export default shippingSlice.reducer;