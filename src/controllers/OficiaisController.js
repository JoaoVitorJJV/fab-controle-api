import { Alistados, Opnioes, Patentes, SiglasPainel, SiglasUsuarios, Usuarios } from "../models/Models.js";
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
        const oficial = req.headers['authorization'];
        const status = req.body.status
        const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        var nomeStr = nome.toString()
        var pat = parseInt(patente)
       
        var statusStr = status.toString()


        const oficialUsu = await Usuarios.findOne({

            where: {
                token: oficial
            }
        })
        var ofc = oficialUsu.nickname.toString()
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
                var hoje = new Date()

                var hojeFormatado = hoje.toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit', year: 'numeric'})
                await Alistados.create({
                    nickname: nomeStr,
                    patente_id: patente,
                    registro: datetime,
                    promovido_por: ofc,
                    ultima_promocao: datetime,
                    status: statusStr,
                    registro_data: hojeFormatado
                })

                LogsController.gerarLog(ofc, `Alistou o militar ${nomeStr} no painel.`, datetime)

                res.json({ auth: true, nome: nomeStr, msg: 'Militar alistado com sucesso, dê as boas vindas!' })
            } else {

                const userId = verifyUser.id
                const userName = verifyUser.nickname
                await Alistados.update({ patente_id: pat, ultima_promocao: datetime }, {
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
              
                if (verifyUser.patente_id < pat) {
              
                    msg = `O militar ${userName} foi promovido com sucesso, dê os parabéns ao mesmo!`
                } else if (verifyUser.patente_id == pat) {
                    msg = `Nenhuma ação foi feita com esse militar.`
                }else{
                    msg = `O militar ${userName} foi rebaixado com sucesso.`
                }
                LogsController.gerarLog(ofc, `Promoveu/rebaixou o militar ${nomeStr} no painel.`, datetime)
                res.json({ auth: true, msg })
            }


        } else {
            res.json({ auth: false, msg: 'Os campos não foram enviados corretamente.' })
        }

    }

    static verificacaoSigla = async (siglaID, patenteUsuarioId) => {
        const sigla = await SiglasPainel.findOne({
            where: {
                id: siglaID
            }
        })

        if(sigla){
            const patMin = sigla.a_partir_de
            const patNumero = await Patentes.findOne({
                where: {
                    nome_sem_estrela: patMin
                }
            })

         

            if(patNumero.id >= patenteUsuarioId){
                return true
            }else{
                return false
            }
        }
    }

    static inserirSigla = async (req, res, next) => {
        const token = req.headers['authorization'];
        const nome = req.body.nome
        const sigla = req.body.sigla
        let dataISO = new Date()
        const datetime = new Date(`${dataISO}+0300`).toISOString().slice(0, 19).replace('T', ' ');


        if (nome && sigla) {
            
            const nomeOficial = await Usuarios.findOne({
                where: {
                    token
                }
            })
            const ver = this.verificacaoSigla(sigla, nomeOficial.pat_id)

            if(ver){
                const nomeStr = nome.toString()
                const idAlistado = await Alistados.findOne({
                    attributes: ['id'],
                    where: {
                        nickname: nomeStr
                    }
                })
    
                const siglaBD = await SiglasPainel.findOne({
                    where: {
                        id: sigla
                    }
                })
    
    
                if (idAlistado) {
                    if (siglaBD.nome !== "PARA-SAR") {
                        const siglaExistente = await SiglasUsuarios.findAll({
                            where: {
                                id_usuario: idAlistado.id
                            }
                        })
    
                        if (siglaExistente) {
    
                            await Promise.all(siglaExistente.map(async (siglaUser) => {
                              
                                if (siglaUser.sigla !== 'PARA-SAR') {
                                    await SiglasUsuarios.destroy({
                                        where: {
                                            id_usuario: idAlistado.id,
                                            id_sigla: siglaUser.id_sigla
                                        }
                                    })
                                }
                            }))
    
                        }
                    }
    
    
    
                    if (siglaBD) {
                        await SiglasUsuarios.create({
                            id_usuario: idAlistado.id,
                            sigla: siglaBD.nome,
                            atribuido_em: datetime,
                            id_sigla: siglaBD.id,
                            ordem: siglaBD.ordem
                        })
                    }
    
                    LogsController.gerarLog(nomeOficial.nickname, `Aplicou a sigla: ${siglaBD.nome} ao alistado ${nome}`, datetime)
                    return res.json({ auth: true, msg: 'Sigla aplicada com sucesso!' })
                } else {
                    return res.json({ auth: false, msg: 'O Militar precisa ser alistado.' })
                }
            }else{
                return res.json({auth: false, msg: 'Você não tem permissão para atribuir essa sigla aeste usuario.'})
            }
         
        } else {
            return res.json({ auth: false, msg: 'Campos enviados incorretamente.' })
        }

    }

    static removerSigla = async (req, res, next) => {
        const token = req.headers['authorization'];
        const nome = req.body.nome
        const sigla = req.body.sigla
        let dataISO = new Date()
        const datetime = new Date(`${dataISO}+0300`).toISOString().slice(0, 19).replace('T', ' ');


        if(nome && sigla){
            const oficial = await Usuarios.findOne({
                where: {
                    token
                }
            })

            const ver = this.verificacaoSigla(sigla, oficial.pat_id)

            if(ver){
                const usuario = await Alistados.findOne({
                    where: {
                        nickname: nome
                    }
                })

                if(usuario){
                    const verificarSigla = await SiglasUsuarios.findOne({
                        where: {
                            id_usuario: usuario.id,
                            id_sigla: sigla
                        }
                    })

                    if(verificarSigla){
                        await SiglasUsuarios.destroy({
                            where: {
                                id: verificarSigla.id                                                              
                            }
                        })

                        LogsController.gerarLog(oficial.nickname, `Removeu a sigla: ${verificarSigla.sigla} do usuário ${usuario.nickname}`, datetime)
                        return res.json({auth: true, msg: 'Sigla removida com sucesso!'})
                    }else{
                        return res.json({auth: false, msg: 'O militar informado não possui essa sigla.'})
                    }
                }else{
                    return res.json({auth: false, msg: 'O Militar precisa ser alistado.'})
                }
            }else{
                return res.json({auth: false, msg: 'Você não tem permissão para remover essa sigla.'})
            }
        }else{
            return res.json({auth: false, msg: 'Campos enviados incorretamente.'})
        }
    }
    static criarUsuario = async (req, res, next) => {
        const token = req.headers['authorization'];
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
                token
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
                    const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
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

        if (usuario) {
            return res.json({ auth: true, usuario })
        } else
            return res.json({ auth: false })



    }

    static getDateTime = () => {
        const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');

        return datetime;
    }

    static editarUsuario = async (req, res, next) => {
        const token = req.headers['authorization'];
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
                token
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

    static getUsuarioController = async (idEnviado) => {
        const result = await Usuarios.findOne({
            where: {
                id: idEnviado
            }
        })

        return result.nickname
    }

    static bloquearUsuario = async (req, res, next) => {
        const token = req.headers['authorization'];
        const nome = req.body.nome

        if (nome == 'Alberto-Dumont') {
            return res.json({ auth: false, msg: 'Você não pode bloquear esse usuário.' })
        }

        const usuarioEnviado = await Usuarios.findOne({
            where: {
                nickname: nome
            }
        })

        await Usuarios.update({ status: (usuarioEnviado.status == 1 ? 0 : 1) }, {
            where: {
                nickname: nome
            }
        })

        const usuario = await Usuarios.findOne({
            where: {
                token
            }
        })

        const datetime = this.getDateTime()


        LogsController.gerarLog(usuario.nickname, `${usuarioEnviado.status == 1 ? 'Desbloqueou' : 'Bloqueou'} o usuário ${nome}`, datetime)

        res.json({ auth: true, msg: `${nome} ${usuarioEnviado.status == 1 ? 'desbloqueado' : 'bloqueado'} com sucesso!` })
    }

    static deleteUsuario = async (req, res, next) => {
        const token = req.headers['authorization'];
        const usuarioNome = req.body.nome

        const usuario = await Usuarios.findOne({
            where: {
                token
            }
        })

        const usuarioExcluir = await Usuarios.findOne({
            where: {
                nickname: usuarioNome
            }
        })

        if(usuario){
            if(usuario.nickname === 'Alberto-Dumont'){
                if(usuarioExcluir){
                    await Usuarios.destroy({
                        where: {
                            id: usuarioExcluir.id
                        }
                    })

                    const datetime = this.getDateTime()

                    LogsController.gerarLog(usuario.nickname, `Excluiu o usuário: ${usuarioExcluir.nickname}`, datetime)
                    return res.json({auth: true, msg: `${usuarioExcluir.nickname} foi excluido com sucesso.`})
                }else{
                    return res.json({auth: false, msg: `O usuário informado não existe.`})
                }
                
            }else{
                return res.json({auth: false, msg: `Você não tem permissão para excluir usuários.`})
            }
        }else{
            return res.json({auth: false, msg: `Ocorreu um erro, tente novamente mais tarde.`})
        }
    }

    static giveOpniao = async (req, res, next) => {
        const nomeOficial = req.body.oficial
        const nomeUsuario = req.body.nomeUsuario
        const opniao = req.body.opniao


        if (nomeOficial && nomeUsuario && opniao) {
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

            if (verifyUser) {
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
                if (patenteOficial.id < 16) {
                    if (patenteUsuario.id < 10) {

                        await Opnioes.create({
                            id_usuario: verifyUser.id,
                            nome_oficial: oficial.nickname,
                            texto: opniao.toString()
                        })

                        LogsController.gerarLog(nomeOficial, `Atribuiu a opnião: ${opniao} ao usuário ${verifyUser.nickname}`, datetime)
                        return res.json({ auth: true, msg: `Opnião de ${nomeUsuarioVer} inserida com sucesso!` })
                    } else {
                        return res.json({ auth: false, msg: 'Somente o Alto Comando pode dar opnião para Oficiais!' })
                    }
                } else {
                    await Opnioes.create({
                        id_usuario: verifyUser.id,
                        nome_oficial: oficial.nickname,
                        texto: opniao.toString()
                    })

                    LogsController.gerarLog(nomeOficial, `Atribuiu a opnião: ${opniao} ao usuário ${verifyUser.nickname}`, datetime)
                    return res.json({ auth: true, msg: `Opnião de ${nomeUsuarioVer} inserida com sucesso!` })
                }
            }

            return res.json({ auth: false, msg: `Usuário não encontrado.` })
        }
    }

    static getSiglas = async (req, res, next) => {
        const token = req.headers['authorization'];

        const usuario = await Usuarios.findOne({
            where: {
                token
            }
        })

        if (usuario) {
            const pat_id_usuario = usuario.pat_id

            var siglasArray = []

            const siglas = await SiglasPainel.findAll({
                where: {
                    status: 'ativo'
                },
                order: [
                    ['ordem', 'asc']
                ]
            })

            if (siglas) {
                await Promise.all(siglas.map(async (sigla, i) => {
                    const pat_id_map = await Patentes.findOne({
                        where: {
                            nome_sem_estrela: sigla.a_partir_de
                        }
                    })

                    const pat_id_sigla = pat_id_map.id

                    if (pat_id_usuario >= pat_id_sigla) {
                        siglasArray[i] = {
                            id: sigla.id,
                            nome: sigla.nome
                        }
                    }

                }))

                return res.json({ auth: true, siglas: siglasArray })
            }
        }

        return res.json({ auth: false })
    }

}

export default OficiaisController