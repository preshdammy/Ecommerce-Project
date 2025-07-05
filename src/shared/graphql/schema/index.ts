import { mergeTypeDefs } from '@graphql-tools/merge';
import { mergeResolvers } from '@graphql-tools/merge';
import { userresolver } from './users/userresolver';
import { usertypedef } from './users/usertypedef';
import { adminresolver } from './admin/adminresolver';
import { adminTypeDefs } from './admin/admintypedefs';
import vendorTypeDefs from './vendor/vendortypedef';
import { VendorResolver } from './vendor/vendorresolver';
import { producttypedef } from './products/producttypedef';
import { productresolver } from './products/productresolver';

export const resolvers = mergeResolvers([
  userresolver,
  adminresolver,
  VendorResolver,
  productresolver
]);

console.log('TypeDef types:', {
  usertypedef: typeof usertypedef,
  adminTypeDefs: typeof adminTypeDefs,
  vendortypedef: typeof vendorTypeDefs,
  producttypedef: typeof producttypedef
});

export const typeDefs = mergeTypeDefs([
  usertypedef,
  adminTypeDefs,  
  vendorTypeDefs,
  producttypedef
], {
  throwOnConflict: true
});