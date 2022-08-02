import { Alistados, Opnioes, Patentes, Usuarios } from "../models/Models.js";
import validator from "validator";
import LogsController from "./LogsController.js";
import bcrypt from 'bcrypt';

class OficiaisController {
    static oficiaisEPatentes = async (req, res, next) => {

        const usuarios = await Usuarios.findAll({
            where: {
                status: 0,
                tipo: 'oficial'
            },
            order: [
                ["pat_id", "ASC"]
            ]
        })

        var oficiaisObj = []
        const asyncRes = await Promise.all(usuarios.map(async (value, i) => {

            const resul = await Patentes.findOne({
                attributes: ['nome_sem_estrela'],
                where: {
                    id: value.pat_id
                }
            })

            return oficiaisObj[i] = {
                oficial: value.nickname + ', ' + resul.nome_sem_estrela,
                nome: value.nickname
            }
        }))

        res.json({ auth: true, usuarioPat: oficiaisObj })
    }

    static inserirAlistado = async (req, res, next) => {
        const nome = req.body.nome
        const patente = req.body.pat
        const oficial = req.body.ofc
        const status = req.body.status
        let dataISO = new Date()
        const datetime = new Date(`${dataISO}+0300`).toISOString().slice(0, 19).replace('T', ' ');
        var nomeStr = nome.toString()
        var pat = parseInt(patente)
        var ofc = oficial.toString()
        var statusStr = status.toString()

        const oficialUsu = await Usuarios.findOne({

            where: {
                nickname: ofc
            }
        })

        const verificacaoPerm = this.verificarPermissao(oficialUsu.pat_id, patente)


        if (!verificacaoPerm) {
            return res.json({ auth: false, msg: 'Você não tem permissão para promover a essa patente' })
        }

        if (!validator.isEmpty(nomeStr) || !validator.isEmpty(ofc)) {
            const verifyUser = await Alistados.findOne({
                where: {
                    nickname: nomeStr
                }
            })

            if (!verifyUser) {

                await Alistados.create({
                    nickname: nomeStr,
                    patente_id: patente,
                    registro: datetime,
                    promovido_por: ofc,
                    ultima_promocao: datetime,
                    status: statusStr
                })

                LogsController.gerarLog(ofc, `Alistou o militar ${nomeStr} no painel.`, datetime)

                res.json({ auth: true, nome: nomeStr, msg: 'Militar alistado com sucesso, dê as boas vindas!' })
            } else {

                const userId = verifyUser.id
                const userName = verifyUser.nickname
                await Alistados.update({ patente_id: pat }, {
                    where: {
                        id: userId
                    }
                })

                const verifyAcesso = await Usuarios.findOne({
                    where: {
                        nickname: userName
                    }
                })


                if (verifyAcesso) {
                    await Usuarios.update({ pat_id: pat }, {
                        where: {
                            id: verifyAcesso.id
                        }
                    })
                }
                var msg;
                if (verifyUser.patente_id > pat) {
                    msg = `O militar ${userName} foi promovido com sucesso, dê os parabéns ao mesmo!`
                } else if (verifyUser.patente_id == pat) {
                    msg = `Nenhuma ação foi feita com esse militar.`
                }
                LogsController.gerarLog(ofc, `Promoveu/rebaixou o militar ${nomeStr} no painel.`, datetime)
                res.json({ auth: true, msg })
            }
        } else {
            res.json({ auth: false, msg: 'Os campos não foram enviados corretamente.' })
        }

    }

    static criarUsuario = async (req, res, next) => {
        const nome = req.body.nickname
        const senha = req.body.senha
        const pat = req.body.pat
        const usuarioId = req.body.usuario_id
        const tipo = req.body.tipo || 'praca'
        var saltRounds = 10


        var nomeVer = nome.toString()
        var senhaVer = senha.toString()
        var patente = parseInt(pat)

        const usuarioDB = await Usuarios.findOne({
            where: {
                id: usuarioId
            }
        })

        const patUser = await Patentes.findOne({
            where: {
                id: usuarioDB.pat_id
            }
        })

        const usuario = usuarioDB.nickname

        const verificarPerm = this.verificarPermissao(patUser.id, pat)

        if (!verificarPerm) {
            return res.json({ auth: false, msg: 'Você não tem permissão para criar um usuário nessa patente' })
        }

        if (!validator.isEmpty(nomeVer) || !validator.isEmpty(senhaVer)) {


            const verificarAlistado = await Alistados.findOne({
                where: {
                    nickname: nomeVer
                }
            })

            const verificarUsuario = await Usuarios.findOne({
                where: {
                    nickname: nomeVer
                }
            })

            if (verificarAlistado) {
                if (!verificarUsuario) {
                    const hash = bcrypt.hashSync(senhaVer, saltRounds)
                    let dataISO = new Date()
                    const datetime = new Date(`${dataISO}+0300`).toISOString().slice(0, 19).replace('T', ' ');
                    await Usuarios.create({
                        nickname: nomeVer,
                        senha: hash,
                        pat_id: patente,
                        tipo
                    })

                    await Alistados.update({ patente_id: patente }, {
                        where: {
                            id: verificarAlistado.id
                        }
                    })

                    LogsController.gerarLog(usuario, `Criou o acesso do usuário ${nomeVer}`, datetime)
                    return res.json({ auth: true, msg: `Usuário ${nomeVer} criado com sucesso!` })
                } else {
                    return res.json({ auth: false, msg: 'O usuário já existe!' })
                }

            } else {
                return res.json({ auth: false, msg: 'O usuário precisa ser alistado!' })
            }
        } else {
            return res.json({ auth: false, msg: 'Campos enviados incorretamente' })
        }
    }

    static verificarPermissao = (patId, pat_promocao) => {
        switch (patId) {
            case 10: {
                if (pat_promocao > 2) {
                    return false;
                }

                return true;
            }

            case 11: {

                if (pat_promocao > 3) {
                    return false;
                }

                return true;
            }

            case 12: {
                if (pat_promocao > 4) {
                    return false;
                }

                return true;
            }

            case 13: {
                if (pat_promocao > 5) {
                    return false;
                }

                return true;
            }

            case 14: {
                if (pat_promocao > 6) {
                    return false;
                }

                return true;
            }

            case 15: {
                if (pat_promocao > 9) {
                    return false;
                }

                return true;
            }

            case 16: {
                if (pat_promocao > 10) {
                    return false;
                }

                return true;
            }

            case 17: {
                if (pat_promocao > 11) {
                    return false;
                }

                return true;
            }

            case 18: {
                if (pat_promocao > 12) {
                    return false;
                }

                return true;
            }

            case 19: {
                if (pat_promocao > 13) {
                    return false;
                }

                return true;
            }

            case 20: {
                return true
            }

        }
    }

    static getUsuarioNome = async (req, res, next) => {
        const nome = req.query.nome

        const usuario = await Usuarios.findOne({
            where: {
                nickname: nome
            }
        })

        if(usuario){
           return  res.json({ auth: true, usuario })
        }else
        return res.json({auth: false})

        

    }

    static getDateTime = () => {
        let dataISO = new Date()
        const datetime = new Date(`${dataISO}+0300`).toISOString().slice(0, 19).replace('T', ' ');

        return datetime;
    }

    static editarUsuario = async (req, res, next) => {
        const nome = req.body.nome
        const pat = req.body.pat
        const senha = req.body.senha
        const pat_id = req.body.patUsuario
        const nomeUsuario = req.body.nomeUsuario

        const nomeVer = nome.toString()
        const patente = parseInt(pat)
        const patId = parseInt(pat_id)
        const senhaVer = senha.toString()
        var novaSenha = ''

        if (nomeVer === 'Alberto-Dumont' || nomeVer === 'Admin') {
            return res.json({ auth: false, msg: 'Você não pode editar esse usuário' })
        }

        const usuarioEnviado = await Usuarios.findOne({
            where: {
                nickname: nomeVer
            }
        })

        if (usuarioEnviado) {
            const patenteUsuarioEnviado = await Patentes.findOne({
                where: {
                    id: usuarioEnviado.pat_id
                }
            })

            const verificacao = this.verificarPermissao(patId, patenteUsuarioEnviado.id)

            if (!verificacao) {
                return res.json({ auth: false, msg: 'Você não pode editar esse usuário' })
            }

            if (patenteUsuarioEnviado.id !== patente) {
                const novaVerificacao = this.verificarPermissao(patId, patente)

                if (!novaVerificacao) {
                    return res.json({ auth: false, msg: 'Você não pode dar essa patente a este usuário.' })
                }
            }

            if (usuarioEnviado.senha !== senhaVer) {
                const hash = bcrypt.hashSync(senhaVer, 10)
                novaSenha = hash
            }
            

            await Usuarios.update({ nickname: nomeVer, pat_id: patente, senha: (novaSenha ? novaSenha : usuarioEnviado.senha) }, {
                where: {
                    id: usuarioEnviado.id
                }
            })


           const datetime = this.getDateTime()

            const usuarioNome = await Usuarios.findOne({
                where: {
                    nickname: nomeUsuario
                }
            })
            LogsController.gerarLog(usuarioNome.nickname, `Editou o usuário ${nomeVer}`, datetime)

            res.json({ auth: true, msg: 'Usuário editado com sucesso!' })
        }

    }

    static getUsuarioController =  async (idEnviado) => {
        const result = await Usuarios.findOne({
            where: {
                id: idEnviado
            }
        })

        return result.nickname
    }

    static bloquearUsuario = async (req, res, next) => {
        const nome = req.body.nome
        const user = req.body.usuarioID

        if(nome == 'Alberto-Dumont'){
            return res.json({auth: false, msg: 'Você não pode bloquear esse usuário.'})
        }

        const usuarioEnviado = await Usuarios.findOne({
            where: {
                nickname: nome
            }
        })

        await Usuarios.update({status: (usuarioEnviado.status == 1 ? 0 : 1)}, {
            where: {
                nickname: nome
            }
        })

        const usuario = await Usuarios.findOne({
            where: {
                id: user
            }
        })

        const datetime = this.getDateTime()


        LogsController.gerarLog(usuario.nickname, `${usuarioEnviado.status == 1 ? 'Desbloqueou' : 'Bloqueou'} o usuário ${nome}`, datetime)

        res.json({auth: true, msg: `${nome} ${usuarioEnviado.status == 1 ? 'desbloqueado' : 'bloqueado'} com sucesso!`})
    }
    
    static giveOpniao = async (req, res, next) => {
        const nomeOficial = req.body.oficial
        const nomeUsuario = req.body.nomeUsuario
        const opniao = req.body.opniao


        if(nomeOficial && nomeUsuario && opniao){
            var nomeOficialVer = nomeOficial.toString()
            const nomeUsuarioVer = nomeUsuario.toString()

            const verifyUser = await Usuarios.findOne({
                where: {
                    nickname: nomeUsuarioVer
                }
            })

            const oficial = await Usuarios.findOne({
                where: {
                    nickname: nomeOficialVer
                }
            })

            if(verifyUser){
                const patenteOficial = await Patentes.findOne({
                    where: {
                        id: oficial.pat_id
                    }
                })

                const patenteUsuario = await Patentes.findOne({
                    where: {
                        id: verifyUser.pat_id
                    }
                })
                const datetime = this.getDateTime()
                if(patenteOficial.id < 16){
                    if(patenteUsuario.id < 10){

                        await Opnioes.create({
                            id_usuario: verifyUser.id,
                            nome_oficial: oficial.nickname,
                            texto: opniao.toString()
                        })
                        
                        LogsController.gerarLog(nomeOficial, `Atribuiu a opnião: ${opniao} ao usuário ${verifyUser.nickname}`, datetime)
                        return res.json({auth: true, msg: `Opnião de ${nomeUsuarioVer} inserida com sucesso!`})
                    }else{
                        return res.json({auth: false, msg: 'Somente o Alto Comando pode dar opnião para Oficiais!'})
                    }
                }else{
                    await Opnioes.create({
                        id_usuario: verifyUser.id,
                        nome_oficial: oficial.nickname,
                        texto: opniao.toString()
                    })

                    LogsController.gerarLog(nomeOficial, `Atribuiu a opnião: ${opniao} ao usuário ${verifyUser.nickname}`, datetime)
                    return res.json({auth: true, msg: `Opnião de ${nomeUsuarioVer} inserida com sucesso!`})
                }                               
            }

            return res.json({auth: false, msg: `Usuário não encontrado.`})
        }
    }

}

export default OficiaisController