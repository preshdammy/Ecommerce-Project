import React from 'react'
import ProductDescriptionClient from './index'

type params = {
    params:{
        slug: string
    }
}

const Oneproduct = async({params}:params) => {
    const {slug} =await params
    console.log(slug)
  return (
    <div>
      <ProductDescriptionClient slug={slug} />
    </div>
  )
}

export default Oneproduct
