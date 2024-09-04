import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Detail } from './Detail'
import { Home } from './Home'
import { Login } from './Login'
import { Mypage } from './Mypage'
import { MyCart } from './MyCart'
import { Order } from './Order'
import { CategoryProduct } from 'views/CategoryProduct'
import { JoinStep1 } from './join/JoinStep1'
import { JoinStep2 } from './join/JoinStep2'
import { JoinStep3 } from './join/JoinStep3'
import { PaymentDetails } from './MyPage/PaymentDetails'
import OAuth from './Authentication/OAuth'
import { SuccessOrder } from './SuccessOrder'
import GuestOrderSearch from './GuestOrderSearch'
import { OrderRedirectPage } from './OrderRedirectPage'
import { OAuthCallback } from './Authentication/OAuthCallback'
import { FindAccount } from './FindAccount'


export const Router:React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/best" element={<CategoryProduct path='best'/>} />
      <Route path="/new" element={<CategoryProduct path='new'/>} />
      <Route path="/all" element={<CategoryProduct path='all'/>} />
      <Route path="/timeDeal" element={<CategoryProduct path='timeDeal'/>} />
      <Route path="/recommend" element={<CategoryProduct path='recommend'/>} />
      <Route path="/detail/:productId" element={<Detail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/mypage/*" element={<Mypage />} />
      <Route path="/joinStep1" element={<JoinStep1 />} />
      <Route path="/joinStep2" element={<JoinStep2 />} />
      <Route path="/joinStep3" element={<JoinStep3 />} />
      <Route path="/cart" element={<MyCart />} />
      <Route path="/order" element={<Order />} />
      <Route path="/paymentDetails" element={<PaymentDetails />} />
      <Route path="/categoryProducts/:mainCategory" element={<CategoryProduct path='categoryProducts/category'/>} />
      <Route path="/categoryProducts/:mainCategory/:subCategory" element={<CategoryProduct path='categoryProducts/category/sub'/>} />
      <Route path="/product/search/:mainCategory" element={<CategoryProduct path='search'/>} />
      <Route path='/auth/oauth-response/:token' element={<OAuth/>} />
      <Route path='/auth/callback' element={<OAuthCallback/>} />
      {/* <Route path='/successOrder' element={<SuccessOrder/>} /> */}
      <Route path='/guestOrderSearch' element={<GuestOrderSearch/>} />
      <Route path='/successOrder' element={<OrderRedirectPage/>} />
      <Route path='/findAccount' element={<FindAccount/>} />
    </Routes>
  )
}
