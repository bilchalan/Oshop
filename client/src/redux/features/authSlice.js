import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {axiosPublic} from '../axiosPublic';
import axiosPrivate from '../axiosPrivate';

export const registration=createAsyncThunk('auth/registration',async({formData,toast},{rejectWithValue})=>{
    try{
        const {data}=await axiosPublic.post(`/register`,formData,{headers:{'Content-type':'multipart/form-data'}});
        toast.success('Successfully regstered.');
        console.log(data.user);
        return data;

    }catch(error){
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
export const login=createAsyncThunk('auth/login',async({jsonData,toast},{rejectWithValue})=>{
    try{
        const {data}=await axiosPublic.post(`/login`,jsonData);
        toast.success('Successfully logged in.');
        return data;

    }catch(error){
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const logout=createAsyncThunk('auth/logout',async({toast},{rejectWithValue})=>{
    try{
        const {data}=await axiosPublic.post(`/logout`);
        toast.success('Successfully logged out.');
        return data;

    }catch(error){
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const changePassword=createAsyncThunk('auth/changePassword',async({jsonData,toast},{rejectWithValue})=>{
    try{
        const {data}=await axiosPrivate.put(`/password/update`,jsonData);
        toast.success('Password changed.');
        return data;

    }catch(error){
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const updateProfile=createAsyncThunk('auth/updateProfile',async({formData,toast},{rejectWithValue})=>{
    try{
        const {data}=await axiosPrivate.put(`/me/update`,formData,{headers:{'Content-type':'multipart/form-data'}});
        toast.success('Successfully updated.');
        return data;

    }catch(error){
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const getAllUsers=createAsyncThunk('auth/getAllUsers',async({toast},{rejectWithValue})=>{
    try{
        const {data}=await axiosPrivate.get(`users`);
        return data;

    }catch(error){
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const deleteUser=createAsyncThunk('auth/deleteUser',async({id,toast},{rejectWithValue})=>{
    try{
        const {data}=await axiosPrivate.delete(`users/${id}`);
        return data;

    }catch(error){
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
export const getUserDetails=createAsyncThunk('auth/getUserDetails',async({id,toast},{rejectWithValue})=>{
    try{
        const {data}=await axiosPrivate.get(`users/${id}`);
        return data;

    }catch(error){
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const updateUserRole=createAsyncThunk('auth/updateUserRole',async({id,jsonData,toast},{rejectWithValue})=>{
    try{
        const {data}=await axiosPrivate.put(`users/${id}`,jsonData);
        toast.success('User updated.');
        return data;

    }catch(error){
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
const authSlice=createSlice({
    name:'auth',
    initialState:{
        mutationResult:{success:false},
        credentials:{},
        userlist:{users:[]},
        userDetails:{user:{}},
        persist:JSON.parse(localStorage.getItem('persist')) || false,
    },
    reducers:{
        persistLogin:(state,action)=>{
            state.persist=action.payload;
            localStorage.setItem('persist',action.payload);
        },
        resetMutationResult:(state)=>{
            state.mutationResult.success=false; 
        },
        refreshUserDetails:(state,action)=>{
            state.credentials.accessToken=action.payload.accessToken;
            state.credentials.user=action.payload.user;  
        }
    },
    extraReducers:{
        //registration
        [registration.pending]:(state,action)=>{
            state.mutationResult.loading=true;
        },
        [registration.fulfilled]:(state,action)=>{
            state.mutationResult.loading=false;
            state.mutationResult.success=action.payload.success;
            
        },
        [registration.rejected]:(state,action)=>{
            state.mutationResult.loading=false;
        },
        //login
        [login.pending]:(state,action)=>{
            state.credentials.loading=true;
        },
        [login.fulfilled]:(state,action)=>{
            state.credentials.loading=false;
            state.credentials.accessToken=action.payload.accessToken;
            state.credentials.user=action.payload.user;            
        },
        [login.rejected]:(state,action)=>{
            state.credentials.loading=false;
            state.credentials.error=action.payload;
        },
        //logout
        [logout.pending]:(state,action)=>{
            state.credentials.loading=true;
        },
        [logout.fulfilled]:(state,action)=>{
            state.credentials={};
            state.persist=false;
            localStorage.setItem('persist',false);
        },
        [logout.rejected]:(state,action)=>{
            state.credentials.loading=false;
            state.credentials.error=action.payload;
        },
        // change password
        [changePassword.pending]:(state,action)=>{
            state.mutationResult.loading=true;
        },
        [changePassword.fulfilled]:(state,action)=>{
            state.mutationResult.loading=false;
            state.mutationResult.success=action.payload.success;
            
        },
        [changePassword.rejected]:(state,action)=>{
            state.mutationResult.loading=false;
        },

        //update profile
        [updateProfile.pending]:(state,action)=>{
            state.mutationResult.loading=true;
        },
        [updateProfile.fulfilled]:(state,action)=>{
            state.mutationResult.loading=false;
            state.mutationResult.success=action.payload.success;
            state.credentials.user=action.payload.user;            
        },
        [updateProfile.rejected]:(state,action)=>{
            state.mutationResult.loading=false;
            state.credentials.error=action.payload;
        },

        //get all user list
        [getAllUsers.pending]:(state,action)=>{
            state.userlist.loading=true;
        },
        [getAllUsers.fulfilled]:(state,action)=>{
            state.userlist.loading=false;
            state.userlist.users=action.payload.users;            
        },
        [getAllUsers.rejected]:(state,action)=>{
            state.userlist.loading=false;
            state.userlist.error=action.payload;
        },

        // delete an user
        [deleteUser.pending]:(state,action)=>{
            state.mutationResult.loading=true;
        },
        [deleteUser.fulfilled]:(state,action)=>{
            state.mutationResult.loading=false;
            state.mutationResult.success=action.payload.success;           
        },
        [deleteUser.rejected]:(state,action)=>{
            state.mutationResult.loading=false;
            state.credentials.error=action.payload;
        },
        //get a single user details
        [getUserDetails.pending]:(state,action)=>{
            state.userDetails.loading=true;
        },
        [getUserDetails.fulfilled]:(state,action)=>{
            state.userDetails.loading=false;
            state.userDetails.user=action.payload.user;           
        },
        [getUserDetails.rejected]:(state,action)=>{
            state.userDetails.loading=false;
            state.userDetails.error=action.payload;
        },
        // update role 
        [updateUserRole.pending]:(state,action)=>{
            state.mutationResult.loading=true;
        },
        [updateUserRole.fulfilled]:(state,action)=>{
            state.mutationResult.loading=false;
            state.mutationResult.success=action.payload.success;           
        },
        [updateUserRole.rejected]:(state,action)=>{
            state.mutationResult.loading=false;
            state.credentials.error=action.payload;
        },
    }
})
export const selectMutationResult=(state)=>state.auth.mutationResult;
export const selectLoggedInUser=(state)=>state.auth.credentials;
export const selectUserList=(state)=>state.auth.userlist;
export const selectUserDetails=(state)=>state.auth.userDetails;

export const selectPersist=(state)=>state.auth;

export const {resetMutationResult,refreshUserDetails, persistLogin} =authSlice.actions;

export default authSlice.reducer;