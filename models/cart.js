const fs=require('fs');
const path=require('path')

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
  );

module.exports=class Cart{
    static addProduct(id, ProductPrice){
        //Fetch the previous cart
        
        
        fs.readFile(p, (err,fileContent)=>{
            let cart={products:[], totalPrice: 0};
            if(!err){
                //if no error, means, we got an existing cart
                cart=JSON.parse(fileContent);
            }//analyze the cart=>find existing product
            const existingProductIndex=cart.products.findIndex(prod=>prod.id===id);
            const existingProduct=cart.products[existingProductIndex];
            let updatedProduct;
            if(existingProduct){
                updatedProduct={...existingProduct};
                updatedProduct.qty=updatedProduct.qty+1;
                cart.products=[...cart.products];
                cart.products[existingProductIndex]=updatedProduct;

            }
            else{
                updatedProduct={id:id,qty:1};
                cart.products=[...cart.products,updatedProduct];

            }
            cart.totalPrice =cart.totalPrice+ +ProductPrice;
            fs.writeFile(p, JSON.stringify(cart), err=>{
                console.log(err);
            })
        })


    };
    static deleteProduct(id, productPrice){
            fs.readFile(p,(err, fileContent)=>{
                if(err){
                    return;
                }
                const updatedCart={...JSON.parse(fileContent)};   //copy existing cart
                const product=updatedCart.products.find(prod=>prod.id===id);   //find prod ID
                if(!product){
                    return;
                }
                const productQty=product.qty;
                updatedCart.products=updatedCart.products.filter(    //filter method takes in anonymous func and returns an array of elements that satisfy given condn
                    prod=>prod.id!==id          //return all except one whose id equals prod.id
                )
                updatedCart.totalPrice=updatedCart.totalPrice-productPrice*productQty;

                //write the updated cart 

                fs.writeFile(p, JSON.stringify(updatedCart), err=>{
                    console.log(err);
                })

            })
    }
     static getCart(cb){//get all products into the cart
            fs.readFile(p, (err,fileContent)=>{
                const cart=JSON.parse(fileContent); //JSON TO OBJECT FORMAT
                if(err){
                    cb(null)
                }
                else{
                cb(cart);
                }   

            })

     }
}