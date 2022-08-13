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
//   'fabhbb23_geral', 
//   'fabhbb23_cmd', 
//   '3P%v=ASgJSkL', 
// {
//     host: '162.241.203.146',
//     dialect: 'mysql'
// })

export default instance