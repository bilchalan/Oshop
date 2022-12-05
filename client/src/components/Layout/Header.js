import React from 'react';
import logo from '../../images/OSHOP2.svg';
import './Header.css';
import {NavLink,Link} from 'react-router-dom';
import {useSelector} from 'react-redux';
import DrawerMenu from './DrawerMenu';
import AuthMenu from './AuthMenu';

import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { Tooltip } from '@mui/material';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';

import {selectCartItems} from '../../redux/features/cartSlice';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const Header = () => {
  const {products}=useSelector(selectCartItems);
  return (
    <header>
      <div className='site-header'>
        <div className='primary-menu'>
          <div className='mobile-menu'>
            <DrawerMenu/>
          </div>
          <div className='logo-area'>
            <Tooltip title='Home'>
              <Link to='/'>
                <img src={logo} alt='oshop ecommerce site' style={{width:'90px'}}/>
              </Link>
            </Tooltip>
          </div>
          <nav className='pages-area'>
            <NavLink to='/' className={({isActive})=>isActive?'active':''}>
              <HomeIcon/>Home
            </NavLink>
            <NavLink to='/product' className={({isActive})=>isActive?'active':''}>
              Product
            </NavLink>
            <NavLink to='/about-us' className={({isActive})=>isActive?'active':''}>
              About Us
            </NavLink>
            <NavLink to='/contact-us' className={({isActive})=>isActive?'active':''}>
              Contact Us
            </NavLink>
          </nav>
        </div>
        <div className='secondary-menu'>
          <div className='cart-area'>
            <Tooltip title='Your cart'>
              <Link to='/cart' style={{padding:'8px 15px'}}>
                <StyledBadge badgeContent={products.length>0?products.length:'0'} color='secondary'>
                  <ShoppingCartIcon/>
                </StyledBadge>
              </Link>
            </Tooltip>
          </div>
          <div className='auth-area'>
            <AuthMenu/>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header