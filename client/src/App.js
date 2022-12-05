import React,{useEffect,useState} from 'react';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import notfound from './images/notfound.svg';

import {useDispatch, useSelector} from 'react-redux';
import { axiosPublic } from './redux/axiosPublic';

import {Route,Routes} from 'react-router';
import MainLayout from './components/Layout/MainLayout'
import Aboutus from './components/Pages/Aboutus';
import Contactus from './components/Pages/Contactus';
import Auth from './components/Auth/Auth';
import AuthenticatedRoute from './components/Routes/AuthenticatedRoute';
import AuthorizedRoute from './components/Routes/AuthorizedRoute';
import UserProfile from './components/Auth/UserProfile';
import UpdateProfile from './components/Auth/UpdateProfile';
import UpdatePassword from './components/Auth/UpdatePassword';
import Dashboard from './components/Authorized/Dashboard/Dashboard';

import AddNewBrand from './components/Authorized/Brand/AddNewBrand';
import BrandList from './components/Authorized/Brand/BrandList';
import UpdateBrand from './components/Authorized/Brand/UpdateBrand';

import AddNewCategory from './components/Authorized/Category/AddNewCategory';
import CategoryList from './components/Authorized/Category/CategoryList';
import UpdateCategory from './components/Authorized/Category/UpdateCategory';

import AddNewStore from './components/Authorized/Store/AddNewStore';
import StoreList from './components/Authorized/Store/StoreList';
import UpdateStore from './components/Authorized/Store/UpdateStore';

import AddNewProduct from './components/Authorized/Product/AddNewProduct';
import ProductList from './components/Authorized/Product/ProductList';
import UpdateProduct from './components/Authorized/Product/UpdateProduct';

import OrderList from './components/Authorized/Order/OrderList';
import ProcessOrder from './components/Authorized/Order/ProcessOrder';

import ReviewList from './components/Authorized/Review/ReviewList';

import UserList from './components/Authorized/User/UserList';
import UpdateRole from './components/Authorized/User/UpdateRole';

import Home from './components/Home/Home';

import Products from './components/Product/Products';
import ProductDetails from './components/Product/ProductDetails';

import Cart from './components/Cart/Cart';
import Shipping from './components/Shipping/Shipping';
import ConfirmOrder from './components/ConfirmOrder/ConfirmOrder';
import Payment from './components/Payment/Payment';
import OrderSuccess from './components/Payment/OrderSuccess';

import MyOrders from './components/Order/MyOrders';
import OrderDetails from './components/Order/OrderDetails';

import Unauthorized from './components/Error/Unauthorized';

import {selectLoggedInUser,selectPersist,refreshUserDetails} from '../src/redux/features/authSlice';
import BoxShadowLoader from './components/Skeletons/BoxShadowLoader';


function App() {
  const dispatch=useDispatch();
  const {accessToken}=useSelector(selectLoggedInUser);
  const {persist}=useSelector(selectPersist);
  const [isLoading,setIsLoading]=useState(true);


  useEffect(() => {
    let isMounted=true;
    const verifyRefreshToken=async()=>{
      try {
        const {data}=await axiosPublic.get(`/refresh`);
        dispatch(refreshUserDetails(data));
      } catch (error) {
        console.log(error);
      }
      finally{
        isMounted && setIsLoading(false);
      }
    }
    !accessToken && persist ? verifyRefreshToken() : setIsLoading(false);
    return () => isMounted=false;
  }, [accessToken,dispatch,persist]);
  
  return (
    isLoading ? <BoxShadowLoader/> :
    <div className="App">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <Routes>
        <Route path='/' element={<MainLayout/>}>
          <Route index element={<Home/>}/>
          <Route path='product' element={<Products/>}/>
          <Route path='product/:id' element={<ProductDetails/>}/>
          <Route path='about-us' element={<Aboutus/>}/>
          <Route path='contact-us' element={<Contactus/>}/>
          <Route path='auth' element={<Auth/>}/>
          <Route path='cart' element={<Cart/>}/>

          <Route path='/' element={<AuthenticatedRoute/>}>
            <Route path='profile' element={<UserProfile/>} />
            <Route path='/me/update' element={<UpdateProfile/>} />
            <Route path='/password/update' element={<UpdatePassword/>} />
            <Route path='/shipping' element={<Shipping/>}/>
            <Route path='/confirm-order' element={<ConfirmOrder/>}/>
            <Route path='/payment' element={<Payment/>}/>
            <Route path='/order/success' element={<OrderSuccess/>}/>
            <Route path='/order' element={<MyOrders/>}/>
            <Route path='/order/:id' element={<OrderDetails/>}/>
            <Route path='unauthorized' element={<Unauthorized/>} />

            <Route path='/authorized' element={<AuthorizedRoute/>}>
              <Route path='dashboard' element={<Dashboard/>} />

              <Route path='brand' element={<AddNewBrand/>} />
              <Route path='brandlist' element={<BrandList/>} />
              <Route path='brand/:id' element={<UpdateBrand/>} />

              <Route path='category' element={<AddNewCategory/>} />
              <Route path='categorylist' element={<CategoryList/>} />
              <Route path='category/:id' element={<UpdateCategory/>} />

              <Route path='store' element={<AddNewStore/>} />
              <Route path='storelist' element={<StoreList/>} />
              <Route path='store/:id' element={<UpdateStore/>} />

              <Route path='product' element={<AddNewProduct/>} />
              <Route path='productlist' element={<ProductList/>} />
              <Route path='product/:id' element={<UpdateProduct/>} />

              <Route path='orderlist' element={<OrderList/>}/>
              <Route path='order/:id' element={<ProcessOrder/>}/>

              <Route path='reviewlist' element={<ReviewList/>}/>

              <Route path='userlist' element={<UserList/>}/>
              <Route path='user/:id' element={<UpdateRole/>} />              

            </Route>
          </Route>  

          <Route path="*" element={
            <div style={{textAlign:'center'}}>
              <img src={notfound} alt='not found' width={400} />
            </div>
          } />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
