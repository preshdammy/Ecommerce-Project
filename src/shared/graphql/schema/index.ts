
import {mergeResolvers } from "@graphql-tools/merge";
import { mergeTypeDefs } from '@graphql-tools/merge';
import { usertypedef } from './users/usertypedef';
import { userresolver } from './users/userresolver';
import { adminresolver } from './admin/adminresolver';
import { admintypedef } from './admin/admintypedef';
import vendorTypeDefs from './vendor/vendortypedef';
import { VendorResolver } from './vendor/vendorresolver';
import { producttypedef } from './products/producttypedef';
import { productresolver } from './products/productresolver';
import { reviewresolver } from './reviews/reviewresolver';
import { reviewtypedef } from './reviews/reviewtypedef';



export const resolvers = mergeResolvers([
    userresolver,
    adminresolver,
    VendorResolver,
    productresolver,
    reviewresolver
])
export const typeDefs = mergeTypeDefs([
    usertypedef,
    // admintypedef,
    vendorTypeDefs,
    producttypedef,
    reviewtypedef
  ])
  


