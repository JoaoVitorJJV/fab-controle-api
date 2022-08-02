import express from "express";
import router from "./routes/index.js";
import cors from 'cors'
import jsonwebtoken from 'jsonwebtoken'
import instance from "./config/conn.js";


try {
    await instance.authenticate();
    console.log('Conexão com o banco de dados concluida');
  } catch (error) {
    console.error('Erro na conexão com o banco:', error);
}


const jwt = jsonwebtoken


const app = express()

// app.use(express.json());
app.use(express.json(), cors(), router)



export default app