const Product = require('../models/product');
const Cart=require('../models/cart');
const Order=require('../models/order');
const User = require('../models/user');
const ITEMS_PER_PAGE=2;


exports.getProducts = (req, res, next) => {
  const page=+req.query.page || 1;
  let totalItems;
  Product.findAll()
  .then(product=>{
    return product.length;
  }).then((total)=>{
    totalItems=total;
    return Product.findAll({
      offset:(page-1)*ITEMS_PER_PAGE,
      limit:ITEMS_PER_PAGE
    })
  }).then((products)=>{
    res.json({
      products:products,
      currentPage:page,
      hasNextPage:ITEMS_PER_PAGE*page<totalItems,
      nextPage:page+1,
      hasPreviousPage:page>1,
      previousPage:page-1,
      lastPage:Math.ceil(totalItems/ITEMS_PER_PAGE),
    })
  }).catch((err)=>{
    console.log(err);
  })

  // Product.findAll().then(products=>{
  //   res.json(products)
    // res.render('shop/product-list', {
    //   prods: products,
    //   pageTitle: 'All Products',
    //   path: '/products'
    // });
  
  
  
};


//to get single product after clicking on details
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
// Product.findAll({where:{id:prodId}})
// .then(products=>{
//   res.render('shop/product-detail', {
//     product: products[0],
//     pageTitle: products[0].title,
//     path: '/products'
//   });
// })
// .catch(err=>{
//   console.log(err)
// })

  Product.findByPk(prodId)
  .then(product=>{
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });

  })
  .catch(err=>{
    console.log(err);
  });
};



exports.getIndex = (req, res, next) => {
  const page=+req.query.page || 1;
let totalItems;
  Product.findAll()
  .then(product=>{
    return product.length;
  }).then(numProducts=>{
    totalItems=numProducts;
    return Product.findAll({
      offset:((page-1)*ITEMS_PER_PAGE),
    limit:(ITEMS_PER_PAGE)//used to restrict the amount of data you load
    })
  })
  .then(products=>{
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      currentPage:page,
      hasNextPage:ITEMS_PER_PAGE*page<totalItems,
      hasPreviousPage: page>1,
      nextPage:page+1,
      previousPage:page-1,
      lastPage:Math.ceil(totalItems/ITEMS_PER_PAGE)
    });
  }).catch(err=>{
    console.log(err)
  })
  
};

exports.getCart = (req, res, next) => {
  const page=+req.query.page || 1;
  console.log(page)
  req.user
  .getCart()
  .then(cart=>{
    // console.log(cart)
    const cartp=cart.getProducts().then(prod=>{totalItems=(prod.length)})
    
    // totalItems=cartp.length; 
    // console.log(totalItems) 
   return cart.getProducts({ offset:(page-1)*ITEMS_PER_PAGE,
   limit:ITEMS_PER_PAGE}).then(products=>{
    // console.log(products)
    // res.render('shop/cart', {
    //         path: '/cart',
    //         pageTitle: 'Your Cart',
    //         products: products
    //       });
    // console.log(products)
    res.json({
      products:products,
      currentPage:page,
      hasNextPage:ITEMS_PER_PAGE*page<totalItems,
      nextPage:page+1,
      hasPreviousPage:page>1,
      previousPage:page-1,
      lastPage:Math.ceil(totalItems/ITEMS_PER_PAGE),
    })
   }).catch(err=>{
    console.log(err);
   })
  })
  .catch(err=>{
    console.log(err)
  })
  // Cart.getCart(cart=>{
  //   Product.fetchAll(products=>{
  //     const cartProducts=[];
  //     for(product of products){
  //       const cartProductData=cart.products.find(prod=>prod.id===product.id);
  //       if(cartProductData){
  //         cartProducts.push({productData: product, qty:cartProductData.qty})
  //       }

  //     }
  //     res.render('shop/cart', {
  //       path: '/cart',
  //       pageTitle: 'Your Cart',
  //       products: cartProducts
  //     });
  //   })
  //   })
  
};

exports.postCart=(req,res,next)=>{
 
  const prodId=req.body.productId;
  console.log(prodId);
  let fetchedCart;
  let newQuantity=1;
  req.user
  .getCart()
  .then(cart=>{
    console.log(cart)
    fetchedCart=cart;
    return cart.getProducts({where: {id:prodId}});
  })
  .then(products=>{
    let product;

    if(products.length>0)
    {
      product=products[0];
    }
 
    if(product){//if product already exists
      //...
      const oldQuantity=product.cartItem.quantity;
      newQuantity=oldQuantity+1;
      return product
    }
    return Product.findByPk(prodId)

    })
    .then(product=>{
      return fetchedCart.addProduct(product,
        {
            through:{quantity:newQuantity}
     })
      })
  
   
    .then(()=>{
      // res.redirect('/cart')
      res.status(200).json({success:true, message:'Succesfully aadded product to cart'})
    })
  
  
  .catch(err=>{
    res.status(500).json({success:false,message:'Error occured'})
  })
}
// Product.findById(prodId,(product)=>{
//   Cart.addProduct(prodId,product.price);
// })
//   res.redirect('/cart');


exports.postCartDeleteProduct=(req,res,next)=>{
  const prodId=req.body.productId;
  req.user
  .getCart()
  .then(cart=>{
    return cart.getProducts({where :{id:prodId}})
  })
  .then(products=>{
    const product= products[0];
    return  product.cartItem.destroy();
  })
  .then(result=>{
    res.redirect('/cart')
  })
  .catch(err=>{console.log(err)})
 
 
};

exports.getOrders = (req, res, next) => {
 let ordersinfo=[]
  req.user
  .getOrders()
  .then(async (orders)=>{
    // console.log(order[0].getProducts);
    for(let i=0;i<orders.length;i++){
      let products=await orders[i].getProducts()
      let ordersobj={
        order:orders[i],
        products:products
      }
      ordersinfo.push(ordersobj)
    }
    res.json({ordersinfo:ordersinfo})
  })
  .catch(err=>console.log(err))
 

  // res.render('shop/orders', {
  //   path: '/orders',
  //   pageTitle: 'Your Orders'
  // });
};

exports.postOrders=(req,res,next)=>{
  const User=req.user;
  req.user.getCart()
  .then(cart=>{
  
    return cart.getProducts()
  }).then(products=>{
    User.createOrder()
    .then(order=>{
      // console.log(products)
      const len=products.length;
      for(let i=0;i<len;i++){
        // console.log(products[i].cartItem.quantity)
        order.addProduct(products[i],{through:
          {quantity:products[i].cartItem.quantity}
        })
      }
    })
  }).then(()=>{

    console.log(req.user.id)
    // res.redirect('/cart')
    res.status(200).json({orderId:req.user.id, message:`OrderId: ${req.user.id}:Succesfully placed your order`})
  }).catch(err=>{
    res.status(500).json({success:false,message:'Error occured'})
  })
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
