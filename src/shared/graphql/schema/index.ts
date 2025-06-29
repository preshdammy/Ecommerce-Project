import {mergeResolvers } from "@graphql-tools/merge";
import { mergeTypeDefs } from '@graphql-tools/merge';
import { userresolver } from './users/userresolver';
import { adminresolver } from './admin/adminresolver';
import { admintypedef } from './admin/admintypedef';
import vendorTypeDefs from './vendor/vendortypedef';
import { VendorResolver } from './vendor/vendorresolver';
import { producttypedef } from './products/producttypedef';
import { productresolver } from './products/productresolver';



export const resolvers = mergeResolvers([
    userresolver,
    adminresolver,
    VendorResolver,
    productresolver
])
export const typeDefs = mergeTypeDefs ([
    vendorTypeDefs,

])