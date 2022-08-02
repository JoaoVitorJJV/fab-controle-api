import { Logs } from "../models/Models.js";

class LogsController {
    static gerarLog = async (oficial, acao, datetime) => {
        await Logs.create({
            usuario: oficial,
            acao,
            datetime
        })
    }

    static getLogs = async (req, res, next) => {
        const logs = await Logs.findAll({
            order: [
                ["id", "DESC"]
            ]
        })

        res.json({auth: true, logs})
    }
}

export default LogsController