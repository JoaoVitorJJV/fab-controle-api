import { Central, Usuarios } from "../models/Models.js";
import LogsController from "./LogsController.js";


class CentralController {
    static getAllRelatorios = async (req, res, next) => {

        const relatorios = await Central.findAll({})

        res.json({auth: true, relatorios})
    }

    static createRelatorio = async (req, res, next) => {
        const reqBody = req.body.dados
        var data = {
            oficialResp: reqBody.ofcRespo.toString(),
            dataEnvio: reqBody.dataEnvio.toString(),
            treinador: {
                nome: reqBody.treinadorEnvio.nome.toString(),
                patente: reqBody.treinadorEnvio.patente.toString()
            },
            treinamento: {
                nome: reqBody.treinamentoEnvio.nome.toString(),
                sala: reqBody.treinamentoEnvio.sala.toString()
            },
            nomeDosTreinados: reqBody.nomeDosTreinados.toString(),
            fraseDeInicio: {
                horaInicio: reqBody.fraseDeInicioEnvio.horaInicio.toString(),
                treinamento: reqBody.fraseDeInicioEnvio.treinamento.toString(),
                fim: parseInt(reqBody.fraseDeInicioEnvio.fim)
            },
            fraseFinal: {
                horaFinal: reqBody.fraseFinalEnvio.horaFinal.toString(),
                treinamento: reqBody.fraseFinalEnvio.treinamento.toString(),
                fim: parseInt(reqBody.fraseFinalEnvio.fim)
            },
            reprovados: reqBody.reprovadosEnvio.toString(),
            observacoes: reqBody.observacoesEnvio.toString(),
            idUsuario: reqBody.idUsuario,
            ip: reqBody.ip,
            aprovados: reqBody.nomeDosAprovados,
            patTreinados: reqBody.patenteTreinados
        }

        const usuarioDB = await Usuarios.findOne({
            where: {
                id: data.idUsuario
            }
        })

        if(usuarioDB){
            var nomeUsuario = usuarioDB.nickname
            var relatorio;
            const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');

            await Central.create({
                user_id: data.idUsuario,
                data_envio: data.dataEnvio,
                ip: data.ip,
                relatorio,
                resp_nome: data.oficialResp,
                trei_nome: data.treinador.nome,
                trei_patente: data.treinador.patente,
                treino: data.treinamento.nome,
                sala: data.treinamento.sala,
                hora_inicio: data.fraseDeInicio.horaInicio,
                hora_final: data.fraseFinal.horaFinal,
                inicio_qtd: data.fraseDeInicio.fim,
                inicio_nomes: data.nomeDosTreinados,
                final_qtd: data.fraseFinal.fim,
                sem_aprovados: (data.reprovados ?  1 : 0),
                observacoes: data.observacoes,
                aprovados: data.aprovados,
                usuario: nomeUsuario,
                pat_treinados: data.patTreinados,
                data_hora_envio: datetime,
                reprovados: data.reprovados
            })
            

            LogsController.gerarLog(usuarioDB.nickname, 'Criou um relatório de treinamento', datetime)
            return res.json({auth: true, msg: 'Relatório de treinamento enviado com sucesso!'})
        }

        res.json({auth: false, msg: 'Algum erro ocorreu, tente novamente.'})
    }

    static editRelatorio = async (req, res, next) => {
        const reqBody = req.body.dados
        var data = {
            treinador: {
                nome: (reqBody.treinadorEnvio.nome ? reqBody.treinadorEnvio.nome.toString() : ''),
                patente: (reqBody.treinadorEnvio.patente ? reqBody.treinadorEnvio.patente.toString() : '')
            },
            treinamento: {
                nome: (reqBody.treinamentoEnvio.nome ? reqBody.treinamentoEnvio.nome.toString() : ''),
                sala: (reqBody.treinamentoEnvio.sala ? reqBody.treinamentoEnvio.sala.toString() : '')
            },
            nomeDosTreinados: (reqBody.nomeDosTreinados ? reqBody.nomeDosTreinados.toString() : ''),
            fraseDeInicio: {
                horaInicio: (reqBody.fraseDeInicioEnvio.horaInicio ? reqBody.fraseDeInicioEnvio.horaInicio.toString() : ''),
                treinamento: (reqBody.fraseDeInicioEnvio.treinamento ? reqBody.fraseDeInicioEnvio.treinamento.toString() : ''),
                fim: (reqBody.fraseDeInicioEnvio.fim ? parseInt(reqBody.fraseDeInicioEnvio.fim) : 0)
            },
            fraseFinal: {
                horaFinal: ( reqBody.fraseFinalEnvio.horaFinal ? reqBody.fraseFinalEnvio.horaFinal.toString() : ''),
                treinamento: (reqBody.fraseFinalEnvio.treinamento ? reqBody.fraseFinalEnvio.treinamento.toString() : ''),
                fim: ( reqBody.fraseFinalEnvio.fim ? parseInt(reqBody.fraseFinalEnvio.fim) : '0')
            },
            reprovados: (reqBody.reprovadosEnvio ? reqBody.reprovadosEnvio.toString() : ''),
            observacoes: (reqBody.observacoesEnvio ? reqBody.observacoesEnvio.toString() : ''),
            aprovados: (reqBody.nomeDosAprovados ? reqBody.nomeDosAprovados.toString() : ''),
            patTreinados: (reqBody.patenteTreinados ? reqBody.patenteTreinados.toString() : ''),
            id: reqBody.id,
            idUser: reqBody.idUsuario,
            aprovados: (reqBody.aprovados ? reqBody.aprovados.toString() : '')
        }

        console.log(data.fraseDeInicio.fim)

        const usuarioDB = await Usuarios.findOne({
            where: {
                id: data.idUser
            }
        })

        if(usuarioDB){
            var nomeUsuario = usuarioDB.nickname
            
            let dataISO = new Date()
            const datetime = new Date(`${dataISO}+0300`).toISOString().slice(0, 19).replace('T', ' ');

            await Central.update({
                trei_nome: data.treinador.nome,
                trei_patente: data.treinador.patente,
                treino: data.treinamento.nome,
                sala: data.treinamento.sala,
                hora_inicio: data.fraseDeInicio.horaInicio,
                hora_final: data.fraseFinal.horaFinal,
                inicio_qtd: data.fraseDeInicio.fim,
                inicio_nomes: data.nomeDosTreinados,
                final_qtd: data.fraseFinal.fim,
                observacoes: data.observacoes,
                aprovados: data.aprovados,
                pat_treinados: data.patTreinados,
                aprovados: data.aprovados,
                reprovados: data.reprovados
            }, {
                where: {
                    id: data.id
                }
            })
            

            LogsController.gerarLog(nomeUsuario, `Editou um relatório de treinamento de ID:${data.id}`, datetime)
            return res.json({auth: true, msg: 'Relatório de treinamento editado com sucesso!'})
        }

        res.json({auth: false, msg: 'Algum erro ocorreu, tente novamente.'})
    }

    static deleteRel = async (req, res, next) => {
        const id = req.body.id
        const idUsuario = req.body.idUser

        if(id){
            await Central.destroy({
                where: {
                    id
                }
            })

            const usuario = await Usuarios.findOne({
                where: {
                    id: idUsuario
                }
            })

            const nomeUsuario = usuario.nickname
     
            const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
            
            LogsController.gerarLog(nomeUsuario, `Deletou o relatório de ID: ${id}`, datetime)
            return res.json({auth: true, msg: `Relatório de ID: ${id} deletado!`})
        }

        return res.json({auth: true, msg: 'Ocorreu um erro, verifique se o relatório já foi excluido.'})
    }

    static getRelatorios = async (req, res, next) => {
        const relatorios = await Central.findAll({
            order: [
                ['id', 'desc']
            ],
            limit: 25
        }) 

        res.json({auth: true, relatorios})
    }

    static aceitarRelatorio = async (req, res, next) => {
        const token = req.headers['authorization'];
        const idRel = req.body.idRel

        if(idRel){
            const usuario = await Usuarios.findOne({
                where: {
                    token
                }
            })
    
            if(usuario){
                const nomeUsuario = usuario.nickname
                const relatorio = await Central.findOne({
                    where: {
                        id: idRel
                    }
                })
    
                if(relatorio){
                    const id = relatorio.id
                    let dataISO = new Date()
                    const datetime = new Date(`${dataISO}+0300`).toISOString().slice(0, 19).replace('T', ' ');
    
    
                    await Central.update({
                        status: 'Corrigido',
                        oficial_verificou: nomeUsuario
                    }, {
                        where: {
                            id
                        }
                    })
                    LogsController.gerarLog(nomeUsuario, `Marcou como corrigido o relatório de ID: #${id}`, datetime)
                    return res.json({auth: true})
                }else{
                    return res.json({auth: false, msg: 'Relatório inexistente.'})
                }
    
            }else{
                return res.status(403).json({auth: false, msg: 'Unauthorized'})
            }
        }else{
            return res.json({auth: false, msg: 'Parâmetro ID não enviado.'})
        }

        

    }
}

export default CentralController