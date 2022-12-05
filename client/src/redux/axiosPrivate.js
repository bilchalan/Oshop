import axios from "axios";
import { BASEURL } from "../constants/baseURL";
import {axiosPublic} from './axiosPublic';
import {refreshUserDetails} from './features/authSlice';

let store

export const injectStore = _store => {
  store = _store
}
const axiosPrivate=axios.create({
    baseURL:`${BASEURL}/api/v1`,
    withCredentials:true,
    headers:{'Content-Type':'application/json'}
})

axiosPrivate.interceptors.request.use(
    config=>{
        const accessToken=store?.getState()?.auth?.credentials?.accessToken;
        if(accessToken){            
            if(!config.headers['Authorization']){
                config.headers['Authorization']=`Bearer ${accessToken}`;
            }
        }
        return config;
    },(error)=>Promise.reject(error)
);
axiosPrivate.interceptors.response.use(
    response=>response,
    async (error)=>{
        const prevRequest=error?.config;
        if(error?.response?.status=== 403 && !prevRequest?.sent){
            prevRequest.sent=true;
            const {data}=await axiosPublic.get(`/refresh`);  
            await store.dispatch(refreshUserDetails(data));
            const accessToken=store?.getState()?.auth?.credentials?.accessToken;        
            if(accessToken){
                prevRequest.headers['Authorization']=`Bearer ${data.accessToken}`; 
            }                   
            return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
    }
)

export default axiosPrivate