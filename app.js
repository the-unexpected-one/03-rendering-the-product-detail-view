const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const sequelize= require('./util/database');

const Product=require('./models/product');
const User=require('./models/user');



const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
console.log('1');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { cpSync } = require('fs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

console.log('2');
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
console.log('3');

app.use(errorController.get404);

console.log('4');

Product.belongsTo(User,{constrains: true, onDelete:'CASCADE'})//CASCADE basically does the job of deleting the products related to any user when the user is deleted
User.hasMany(Product)


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
    app.listen(3000);
})
.catch(err=>{
    console.log(err);
console.log('6')
})

