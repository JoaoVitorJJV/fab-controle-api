import { Alistados, Usuarios } from "../models/Models.js";
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken'
import dotenv from 'dotenv'
import LogsController from "./LogsController.js";

class AuthController {
    static login = async (req, res) => {
        const nome = req.body.nome
        const senha = req.body.senha

        const resultado = await Usuarios.findOne({
            where: {
                nickname: nome
            }
        })

        if(resultado){
            if (resultado.status !== 1) {
                const verifyPass = bcrypt.compareSync(senha, resultado.senha);
                if (verifyPass) {
                    const jwt = jsonwebtoken
                    const id = resultado.id
                    const token = jwt.sign({ id }, process.env.SECRET, {
                        expiresIn: '1d'
                    });
    
    
                    await Usuarios.update({ token: token }, {
                        where: {
                            id: resultado.id
                        }
                    })
    
                   return res.json({ auth: true, user: resultado, tokenLogin: token })
                } else {
                    return res.json({ auth: false, msg: 'Usuário ou senha incorretos.' })
                }
    
            } else {
                return res.json({ auth: false, msg: 'Você não tem permissão para logar.' })
            }
        }else{
            return res.json({ auth: false, msg: 'Usuário ou senha incorretos.' })
        }
       

    }


    static cadastro = (req, res) => {
        const nome = req.body.nome
        const senha = req.body.senha
        const pat = req.body.pat
        var saltRounds = 10

        const senhaString = senha.toString()

        const hash = bcrypt.hashSync(senhaString, saltRounds)

        if (hash) {
            Usuarios.create({
                nickname: nome,
                senha: hash,
                pat_id: pat
            })

            return res.json({ auth: true, nome: nome })
        }

        res.json({ auth: false })
    }

    static validateToken = async (req, res) => {
        dotenv.config();
        const jwt = jsonwebtoken
        const token = req.headers['authorization'];
        if (token) {
            jwt.verify(token, process.env.SECRET, async function (err, decoded) {

                if (err) {
                    return res.json({ auth: false, message: 'Failed to authenticate token.', error: true });
                } else {
                    const tokenRes = req.body.token
                    const user = await Usuarios.findOne({
                        where: {
                            token: tokenRes
                        }
                    })


                    if (user) {

                        return res.json({ auth: true, user: user, tokenLogin: user.token })
                    } else {

                        res.json({ auth: false })
                    }
                }

            });
        } else {
            return res.status(200).json({ auth: false, message: 'Nenhum token informado.', error: true });
        }
    }


    static signout = async (req, res) => {
        const user = req.body.user
        const token = req.body.token

        if (user && token) {            
            const usuario = await Usuarios.findOne({
                where: {
                    nickname: user,
                    token
                }
            })


            if(usuario){
                await Usuarios.update({ token: '' }, {
                    where: {
                        id: usuario.id
                    }
                })

                return res.json({ auth: true })
            }else{
                return res.json({auth: false, msg: 'Erro interno LOGOUT#1'})
            }            
        }else{
            return res.json({auth: false, msg: 'Erro interno LOGOUT#2'})
        }


    }

    static getDateTime = () => {
        let dataISO = new Date()
        const datetime = new Date(`${dataISO}+0300`).toISOString().slice(0, 19).replace('T', ' ');

        return datetime;
    }

    static changeSenha = async (req, res, next) => {
        const token = req.headers['authorization'];
        console.log('enter here')
        const senha = req.body.novaSenha
        const senhaAntiga = req.body.senhaAntiga

        if(token && senha && senhaAntiga){
            const novaSenha = senha.toString()
            const senhaAntigaStr = senhaAntiga.toString()

            const usuario = await Usuarios.findOne({
                where: {
                    token
                }
            })

            if(usuario){
                const verifyPass = bcrypt.compareSync(senhaAntigaStr, usuario.senha);
           
                if(verifyPass){
                    const datetime = this.getDateTime()
                    var saltRounds = 10
                    const hash = bcrypt.hashSync(novaSenha, saltRounds)

                    await Usuarios.update({
                        senha: hash
                    }, {
                        where: {
                            id: usuario.id
                        }
                    })

                    LogsController.gerarLog(usuario.nickname, 'Alterou sua senha', datetime)
                    return res.json({auth: true, msg: 'Senha alterada com sucesso!'})
                }else{
                    return res.json({auth: false, msg: 'Senha antiga incorreta.'})
                }
            }else{
                return res.json({auth: false, msg: 'Usuário não encontrado.'})
            }
        }else{
            return res.json({auth: false, msg: 'Campos enviados incorretamente.'})
        }
    }

}

export default AuthController