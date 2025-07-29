
import {mergeResolvers } from "@graphql-tools/merge";
import { mergeTypeDefs } from '@graphql-tools/merge';
import { usertypedef } from './users/usertypedef';
import { userresolver } from './users/userresolver';
import { adminresolver } from './admin/adminresolver';
import { adminTypeDefs } from './admin/admintypedefs';
import vendorTypeDefs from './vendor/vendortypedef';
import { VendorResolver } from './vendor/vendorresolver';
import { producttypedef } from './products/producttypedef';
import { productresolver } from './products/productresolver';
import { reviewresolver } from './reviews/reviewresolver';
import { reviewtypedef } from './reviews/reviewtypedef';
import { notificationresolver } from './notifcations/notifresolvers'
import { notificationTypeDef } from './notifcations/notiftypedefs'
import { orderResolvers } from './orders/orderresolver';
import { orderTypeDef } from './orders/ordertypedef';
import { walletTypeDefs } from "./wallets/wallettypdef";
import { walletResolvers } from "./wallets/walletresolver"

export const resolvers = mergeResolvers([

    userresolver,
    adminresolver,
    VendorResolver,
    productresolver,
    reviewresolver,
    notificationresolver,
    orderResolvers,
    walletResolvers
])
export const typeDefs = mergeTypeDefs([
    usertypedef,
    adminTypeDefs,
    vendorTypeDefs,
    producttypedef,
    reviewtypedef,
    notificationTypeDef,
    orderTypeDef,
    walletTypeDefs
  ])
  



