import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';

import { userresolver } from './users/userresolver';
import { usertypedef } from './users/usertypedef';

import { adminresolver } from './admin/adminresolver';
import { admintypedef } from './admin/admintypedef';

import { vendorresolver } from './vendor/vendorresolver';
import { vendortypedef } from './vendor/vendortypedef';

import { productresolver } from './products/productresolver';
import { producttypedef } from './products/producttypedef';

export const resolvers = mergeResolvers([
  userresolver,
  adminresolver,
  vendorresolver,
  productresolver,
]);
export const typeDefs = mergeTypeDefs([usertypedef]); 


// export const typeDefs = mergeTypeDefs([
//   usertypedef,
//   admintypedef,
//   vendortypedef,
//   producttypedef,
// ]);
