import { Central, Treinamentos } from "../models/Models.js";

class TreinamentosController {
    static getTreinamentos = async (req, res, next) => {
        const treinos = await Treinamentos.findAll({
            where: {
                status: 0
            }
        })

        res.json({auth: true, treinos})
    }

    static getRelatoriosUsuario = async (req, res, next) => {
        const userid = req.query.userID

        const relatorios = await Central.findAll({
            where: {
                user_id: userid
            }
        })

        res.json({auth: true, relatorios})
    }
}

export default TreinamentosController