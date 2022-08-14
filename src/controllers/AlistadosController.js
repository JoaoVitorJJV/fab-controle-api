import { Op } from "sequelize";
import { Alistados, Patentes, Posts } from "../models/Models.js";

class AlistadoController {
    static getRegistro = async (req, res) => {
        const nome = req.query.nome
        const result = await Alistados.findOne({
            attributes: ['registro'],
            where: {
                nickname: nome
            }
        })

        if(result){
            res.json({auth: true, registro: result.registro})
        }else{
            res.json({auth: true, registro: new Date()})
        }
    }

    static getPatNome = async (req, res) => {
        const pat_id = req.query.pat_id

        const result = await Patentes.findOne({             
            where: {
                id: pat_id
            }
        })

        if(result){
            res.json({auth: true, pat_id: pat_id, pat_nome_sem: result.nome_sem_estrela, pat_nome_com: result.pat_nome})
        }else{
            res.json({auth:false})
        }
    }

    static getAlistados = async (req, res, next)  => {
        const alistados = await Alistados.findAll({
            where: {
                nickname: {
                    [Op.ne]: 'Admin_213'
                }
            }
        })

        var alistadosObj = []
        if(alistados){
            await Promise.all(alistados.map(async (alistado, i) => {

                const result = await Patentes.findOne({
                    attributes: ['nome_sem_estrela'],
                    where: {
                        id: alistado.patente_id
                    }
                })

                alistadosObj[i] = {
                    nomeAlistado: alistado.nickname,
                    patente: result.nome_sem_estrela
                }
            }))
        }
        
        res.json({auth: true, alistados: alistadosObj})
    }

   
}

export default AlistadoController