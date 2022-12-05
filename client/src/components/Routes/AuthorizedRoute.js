
import {useSelector} from 'react-redux';
import {useNavigate, Outlet, Navigate} from 'react-router-dom';

import {selectLoggedInUser} from '../../redux/features/authSlice';
import jwtDecode from 'jwt-decode';

import {Box,Typography} from '@mui/material';

import TreeMenu from './Menus/TreeMenu';
import './Authorized.css';
import DrawerTreeMenu from './Menus/DrawerTreeMenu';

const AuthorizedRoute = () => {
    const navigate=useNavigate();
    const {accessToken}=useSelector(selectLoggedInUser);
    let role;
    const {UserInfo}=jwtDecode(accessToken);
    role=UserInfo.roles[0].toString();
    if(role==='admin' || role==='seller'){
        return (
            <>
            <Box sx={{background:'#1976d2', display:'flex', color:'#fff',p:1}}>
                <Box className='mTreeMenu' sx={{minWidth:'225px',mr:1}}>
                    <DrawerTreeMenu/>
                </Box>
                <Box sx={{flexGrow:1}}>
                    <Typography component='div' variant='h6' sx={{textAlign:'center'}}>Dashboard</Typography>
                </Box>
            </Box>
            <Box sx={{display:'flex',flexGrow:1}}>
                <Box className='dTreeMenu' sx={{background:'#1976d2',minWidth:'225px',mr:1}}>
                    <TreeMenu/>                    
                </Box>
                <Box sx={{flexGrow:1}}>
                    <Box sx={{m:'0 auto',p:1}}>
                        <Outlet/>
                    </Box>
                </Box>
            </Box>
            </>
        )
    }else{
        return <Navigate to='/unauthorized'/>
    }
}

export default AuthorizedRoute