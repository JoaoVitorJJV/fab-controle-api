import {Sequelize} from 'sequelize'


const instance = new Sequelize(
  'fab', 
  'root', 
  '', 
  {
    host: 'localhost',
    dialect: 'mysql'
})

// const instance = new Sequelize(
//   'exbrhb80_exercito', 
//   'root', 
//   '', 
//   {
//     host: 'localhost',
//     dialect: 'mysql'
// })

export default instance