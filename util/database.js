//SEquelize uses SQL behind the scenes
const Sequelize=require('sequelize');
 
const sequelize=new Sequelize('node-complete','root','Saloni@22',{
    dialect: 'mysql',
    host:'localhost'
});

module.exports=sequelize;
