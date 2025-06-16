import { mergeTypeDefs } from '@graphql-tools/merge';
import { mergeResolvers } from '@graphql-tools/merge';
import { userresolver } from './users/userresolver';
import { usertypedef } from './users/usertypedef';
import { adminresolver } from './admin/adminresolver';
import { admintypedef } from './admin/admintypedef';
import { vendortypedef } from './vendor/vendortypedef';
import { vendorresolver } from './vendor/vendorresolver';
import { producttypedef } from './products/producttypedef';
import { productresolver } from './products/productresolver';



export const resolvers = mergeResolvers([
    userresolver,
    adminresolver,
    vendorresolver,
    productresolver
])
export const typeDefs = mergeTypeDefs([
    usertypedef,
    admintypedef,
    vendortypedef,
    producttypedef
])