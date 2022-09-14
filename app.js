const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const sequelize= require('./util/database');

const Product=require('./models/product');
const User=require('./models/user');
const Cart=require('./models/cart');
const CartItem=require('./models/cart-item')



const app = express();
const cors=require('cors')

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { cpSync } = require('fs');
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));


app.use((req,res,next)=>{
    User.findByPk(1)
    .then(user=>{
        req.user=user;//stores user as a sequelize object
        next();
    })
    .catch(err=>{
        console.log(err);
    })
})


app.use('/admin', adminRoutes);
app.use(shopRoutes);


app.use(errorController.get404);


Product.belongsTo(User,{constrains: true, onDelete:'CASCADE'})//CASCADE basically does the job of deleting the products related to any user when the user is deleted
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through:CartItem});


sequelize
// .sync({force: true})//force is optional,won't use in production as we don't always want to overwrite our table
.sync()
.then(result=>{ //.sync() method basically checks whether your table exists already in your mySQL and if not, it run a CREATE TABLE statement
        //console.log(result);
    return User.findByPk(1);

}).then(user=>{
    if(!user){
        return User.create({name:'Saloni', email:'test@gmail.com'})
    }
    return user;
})
.then(user=>{
    user.createCart();
})
.then(cart=>{
    app.listen(3000);
})
.catch(err=>{
    console.log(err);

})

