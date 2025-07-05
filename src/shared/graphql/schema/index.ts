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

<<<<<<< HEAD




// import { reviewresolver } from './reviews/reviewresolver';
// import { reviewtypedef } from './reviews/reviewtypedef';
// import { notificationresolver } from './notifcations/notifresolvers'
// import { notificationTypeDef } from './notifcations/notiftypedefs'
// import { orderResolvers } from './orders/orderresolver';
// import { orderTypeDef } from './orders/ordertypedef'


export const resolvers = mergeResolvers([
    userresolver,
    adminresolver,
    VendorResolver,
    productresolver,
    // reviewresolver,
    // notificationresolver,
    // orderResolvers,
   
])

export const typeDefs = mergeTypeDefs([
    usertypedef,
    adminTypeDefs,
    vendorTypeDefs,
    producttypedef,
    // reviewtypedef,
    // notificationTypeDef,
    // orderTypeDef,
    
  ])
  

=======
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
>>>>>>> 47e93d3dd353694d0eae13fd75ed00a429d61477
