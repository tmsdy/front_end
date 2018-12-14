import Vue from 'vue'
import Router from 'vue-router'

import IndexComponent from '@/pages/Index'
import DetailComponent from '@/pages/Detail'
import LoginComponent from '@/pages/Login'
import CartComponent from '@/pages/Cart'
import CheckoutComponent from '@/pages/Checkout'
import PaymentComponent from '@/pages/Payment'
import SuccessComponent from '@/pages/Success'
import UserComponent from '@/pages/User'
import UserOrderComponent from '@/pages/User/Order'
import UserAddressComponent from '@/pages/User/Address'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Index',
            component: IndexComponent
        },
        {
            path: '/detail/:id',
            name: 'Detail',
            component: DetailComponent
        },
        {
            path: '/login',
            name: 'Login',
            component: LoginComponent
        },
        {
            path: '/cart',
            name: 'Cart',
            component: CartComponent
        },
        {
            path: '/checkout',
            name: 'Checkout',
            component: CheckoutComponent
        },
        {
            path: '/payment',
            name: 'Payment',
            component: PaymentComponent
        },
        {
            path: '/success',
            name: 'Success',
            component: SuccessComponent
        },
        {
            path: '/user',
            name: 'User',
            component: UserComponent,
            children: [
                {
                    path: 'order',
                    name: 'UserOrder',
                    component: UserOrderComponent
                },
                {
                    path: 'address',
                    name: 'UserAddress',
                    component: UserAddressComponent
                }
            ]
        }
    ]
})
