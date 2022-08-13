import { Alistados, Patentes, SiglasUsuarios, SiteAvisos, SiteDestaques, Usuarios } from "../models/Models.js";
import LogsController from "./LogsController.js";

class SiteController {
    static createDestaque = async (req, res, next) => {
        const nome = req.body.nomePraca
        const nomeOficial = req.body.nomeOficial
        const datetime = req.body.datetime
        const tipo = req.body.tipo
        const texto = req.body.texto

        if (nome && nomeOficial && datetime && tipo && texto) {
            const nomeStr = nome.toString()
            const nomeOfcStr = nomeOficial.toString()
            const tipoStr = tipo.toString()
            const textoStr = texto.toString()


            const verificacao = await Alistados.findOne({
                where: {
                    nickname: nomeStr
                }
            })

            if (verificacao) {
                const verificacaoSite = await SiteDestaques.findOne({
                    where: {
                        nome: nomeStr
                    }
                })

                const patenteUsuario = await Patentes.findOne({
                    attributes: ['nome_sem_estrela'],
                    where: {
                        id: verificacao.patente_id
                    }
                })


                if (!verificacaoSite) {
                    const verificacaoSiteTipo = await SiteDestaques.findOne({
                        where: {
                            tipo
                        }
                    })

                    if (verificacaoSiteTipo) {
                        await SiteDestaques.destroy({
                            where: {
                                id: verificacaoSiteTipo.id
                            }
                        })
                    }

                    await SiteDestaques.create({
                        nome: nomeStr,
                        patente: (patenteUsuario ? patenteUsuario.nome_sem_estrela : 'Soldado'),
                        texto: textoStr,
                        tipo: tipoStr,
                        data: datetime
                    })

                    let dataISO = new Date()
                    const datetimeLog = new Date(`${dataISO}+0300`).toISOString().slice(0, 19).replace('T', ' ');

                    LogsController.gerarLog(nomeOfcStr, `Promoveu o militar ${nomeStr} a destaque, do tipo ${tipo}`, datetimeLog)
                    return res.json({ auth: true, msg: 'Destaque adicionado com sucesso!' })
                } else {
                    return res.json({ auth: false, msg: 'Esse usuário já está como destaque, caso desje mudar a data, edite o mesmo.' })
                }
            } else {
                return res.json({ auth: false, msg: 'Somente militares alistados podem ser destaque.' })
            }


        } else {
            return res.json({ auth: false, msg: 'Campos enviados incorretamente.' })

        }
    }

    static getDestaques = async (req, res) => {
        const destaques = await SiteDestaques.findAll({})

        var dados = {
            praca: {
                nome: '',
                data: '',
                motivo: '',
                patente: '',
                tipo: ''
            },
            oficial: {
                nome: '',
                data: '',
                motivo: '',
                patente: '',
                tipo: ''
            }
        }

        destaques.map((destaque) => {
            if (destaque.tipo == 'praca') {
                dados.praca.nome = destaque.nome
                dados.praca.data = destaque.data
                dados.praca.motivo = destaque.texto
                dados.praca.patente = destaque.patente
                dados.praca.tipo = destaque.tipo
            } else {
                dados.oficial.nome = destaque.nome
                dados.oficial.data = destaque.data
                dados.oficial.motivo = destaque.texto
                dados.oficial.patente = destaque.patente
                dados.oficial.tipo = destaque.tipo
            }
        })
        res.json({ auth: true, dados })
    }

    static editDestaque = async (req, res, next) => {
        const id = req.body.id
        const nome = req.body.nomePraca
        const nomeOficial = req.body.nomeOficial
        const datetime = req.body.datetime
        const tipo = req.body.tipo
        const texto = req.body.texto

        if (id && nomeOficial && datetime && tipo && texto) {
            const idInt = parseInt(id)
            const nomeStr = nome.toString()
            const nomeOfcStr = nomeOficial.toString()
            const tipoStr = tipo.toString()
            const textoStr = texto.toString()


            const verificacaoDB = await SiteDestaques.findOne({
                where: {
                    id: idInt
                }
            })

            if (verificacaoDB) {
                const verificarAlistado = await Alistados.findOne({
                    where: {
                        nickname: nomeStr
                    }
                })


                if (verificarAlistado) {

                    const patenteUsuario = await Patentes.findOne({
                        attributes: ['nome_sem_estrela'],
                        where: {
                            id: verificarAlistado.patente_id
                        }
                    })
                    await SiteDestaques.update({
                        nome: nomeStr,
                        patente: (patenteUsuario ? patenteUsuario.nome_sem_estrela : 'Soldado'),
                        texto: textoStr,
                        tipo: tipoStr,
                        data: datetime
                    }, {
                        where: {
                            id: verificacaoDB.id
                        }
                    })

                    let dataISO = new Date()
                    const datetimeLog = new Date(`${dataISO}+0300`).toISOString().slice(0, 19).replace('T', ' ');

                    LogsController.gerarLog(nomeOfcStr, `Editou o militar ${verificacaoDB.nome} do destaque, do tipo ${tipo}`, datetimeLog)
                    return res.json({ auth: true, msg: 'Editado com sucesso!' })
                } else {
                    return res.json({ auth: false, msg: 'O militar não é alistado' })
                }

            } else {
                return res.json({ auth: false, msg: 'O militar não é destaque' })
            }
        } else {
            return res.json({ auth: false, msg: 'Campos enviados incorretamente.' })
        }
    }

    static getDestaqueNome = async (req, res, next) => {
        const nome = req.query.nome

        if (nome) {
            const resultado = await SiteDestaques.findOne({
                where: {
                    nome
                }
            })



            if (resultado) {
                var dados = {
                    id: resultado.id,
                    nome: resultado.nome,
                    data: resultado.data,
                    motivo: resultado.texto,
                    patente: resultado.patente,
                    tipo: resultado.tipo
                }

                return res.json({ auth: true, dados })
            } else {
                return res.json({ auth: false, msg: 'O militar fornecido não é destaque' })
            }
        }
        return res.json({ auth: false, msg: 'Erro interno' })

    }

    static getDateTime = () => {
        let dataISO = new Date()
        const datetime = new Date(`${dataISO}+0300`).toISOString().slice(0, 19).replace('T', ' ');

        return datetime;
    }

    static createAviso = async (req, res, next) => {
        const nome = req.body.nome
        const texto = req.body.txt
        const tipo = req.body.tipo
        const titulo = req.body.titulo

        if (nome && tipo && texto) {
            const datetime = this.getDateTime()
            const nomeVer = nome.toString()
            const txt = texto.toString()
            const tipoVer = tipo.toString()

            const verificar = await SiteAvisos.findOne({
                where: {
                    tipo: tipoVer
                }
            })
            const token = req.headers['authorization'];

            const usuario = await Usuarios.findOne({
                where: {
                    token
                }
            })
            if (usuario) {

                if (tipo === 'Novidades') {
                    const verificarNovidades = await SiteAvisos.findAll({
                        where: {
                            tipo: tipoVer
                        }
                    })

                    if (verificarNovidades) {
                        if (verificarNovidades.length === 3) {
                            var id = 0;

                            verificarNovidades.map((aviso) => {
                                id = aviso.id
                            })

                            await SiteAvisos.update({
                                nome: nomeVer,
                                texto: txt,
                                tipo: 'Novidades',
                                datetime,
                                titulo: (titulo ? titulo.toString() : '')

                            }, {
                                where: {
                                    id
                                }
                            })

                            LogsController.gerarLog(usuario.nickname, `Criou um aviso no site, do tipo ${tipoVer}`, datetime)
                            return res.json({ auth: true, msg: 'Aviso criado com sucesso!' })
                        } else {
                            await SiteAvisos.create({
                                nome: nomeVer,
                                texto: txt,
                                tipo: 'Novidades',
                                datetime,
                                titulo: (titulo ? titulo.toString() : '')
                            })

                            LogsController.gerarLog(usuario.nickname, `Criou um aviso no site, do tipo ${tipoVer}`, datetime)
                            return res.json({ auth: true, msg: 'Aviso criado com sucesso!' })
                        }
                    }
                }
                if (verificar) {
                    const verificarQTD = await SiteAvisos.findAll({
                        where: {
                            tipo: tipoVer
                        }
                    })
                    if (verificarQTD.length === 2) {
                        var id;

                        verificarQTD.map((aviso) => {
                            id = aviso.id
                        })
                        await SiteAvisos.update({
                            nome: nomeVer,
                            texto: txt,
                            tipo: 'Global',
                            datetime
                        }, {
                            where: {
                                id
                            }
                        })
                        LogsController.gerarLog(usuario.nickname, `Criou um aviso no site, do tipo ${tipoVer}`, datetime)
                        return res.json({ auth: true, msg: 'Aviso criado com sucesso!' })
                    }else{
                        await SiteAvisos.create({
                            nome: nomeVer,
                            texto: txt,
                            tipo: 'Global',
                            datetime
                        })
    
                        LogsController.gerarLog(usuario.nickname, `Criou um aviso no site, do tipo ${tipoVer}`, datetime)
                        return res.json({ auth: true, msg: 'Aviso criado com sucesso!' })
                    }


                   
                } else {
                    await SiteAvisos.create({
                        nome: nomeVer,
                        texto: txt,
                        tipo: 'Global',
                        datetime
                    })

                    LogsController.gerarLog(usuario.nickname, `Criou um aviso no site, do tipo ${tipoVer}`, datetime)
                    return res.json({ auth: true, msg: 'Aviso criado com sucesso!' })
                }

            }

        }

        return res.json({ auth: false, msg: 'Ocorreu um erro, por favor tente novamente' })
    }

    static getAvisos = async (req, res) => {
        const destaques = await SiteAvisos.findAll({})

        var dados = {
            global: {
                id: '',
                nome: '',
                texto: '',
                tipo: '',
                datetime: ''
            },
            novidades: {
                id: '',
                nome: '',
                texto: '',
                tipo: '',
                datetime: ''
            }
        }

        destaques.map((destaque) => {
            if (destaque.tipo == 'Global') {
                dados.global.id = destaque.id
                dados.global.nome = destaque.nome
                dados.global.texto = destaque.texto
                dados.global.tipo = destaque.tipo
                dados.global.datetime = destaque.datetime
            } else {
                dados.global.id = destaque.id
                dados.novidades.nome = destaque.nome
                dados.novidades.texto = destaque.texto
                dados.novidades.tipo = destaque.tipo
                dados.novidades.datetime = destaque.datetime
            }
        })
        res.json({ auth: true, dados })
    }

    static getAvisoID = async (req, res) => {
        const id = req.query.id

        if (id) {
            const dados = await SiteAvisos.findOne({
                where: {
                    id
                }
            })

            if (dados) {
                return res.json({ auth: true, dados })
            } else {
                return res.json({ auth: false })
            }
        } else {
            return res.json({ auth: false })
        }
    }

    static editarAviso = async (req, res, next) => {
        const id = req.body.id
        const nome = req.body.nome
        const texto = req.body.txt
        const tipo = req.body.tipo


        if (id && nome && tipo && texto) {
            const datetime = this.getDateTime()
            const nomeVer = nome.toString()
            const txt = texto.toString()
            const tipoVer = tipo.toString()

            const verificar = await SiteAvisos.findOne({
                where: {
                    tipo: id
                }
            })

            console.log(id)
            const token = req.headers['authorization'];

            const usuario = await Usuarios.findOne({
                where: {
                    token
                }
            })
            if (usuario) {
                if (verificar) {
                    await SiteAvisos.update({
                        nome: nomeVer,
                        texto: txt,
                        tipo: (tipoVer === "Global" || tipoVer === "Novidades" ? tipoVer : "Global"),
                        datetime
                    }, {
                        where: {
                            id: verificar.id
                        }
                    })

                    LogsController.gerarLog(usuario.nickname, `Criou um aviso no site, do tipo ${tipoVer}`, datetime)
                    return res.json({ auth: true, msg: 'Aviso criado com sucesso!' })
                } else {
                    return res.json({ auth: false, msg: 'Aviso não encontrado' })
                }

            }

        }

        return res.json({ auth: false, msg: 'Ocorreu um erro, por favor tente novamente' })
    }

    static getUltimosAlitos = async (req, res) => {
        const resultado = await Alistados.findAll({
            order: [
                ["id", "DESC"]
            ],
            limit: 5
        })

        res.json({ auth: true, resultado })
    }

    static pesquisaMilitar = async (req, res) => {
        const nome = req.query.nome

        if (nome) {
            const alistado = await Alistados.findOne({
                where: {
                    nickname: nome
                }
            })

            if (alistado) {
                const patente = await Patentes.findOne({
                    attributes: ['nome_sem_estrela'],
                    where: {
                        id: alistado.patente_id
                    }
                })

                const siglas = await SiglasUsuarios.findAll({
                    where: {
                        id_usuario: alistado.id
                    },
                    order: [
                        ['ordem', 'asc']
                    ]
                })

                var sigla = ''

                if (siglas) {
                    await Promise.all(siglas.map(async (siglaUsuario) => {
                        sigla += `<${siglaUsuario.sigla}> `
                    }))
                }

                console.log(sigla)


                var dados =
                {
                    nome: alistado.nickname,
                    patente: patente.nome_sem_estrela,
                    registro: alistado.registro,
                    ultima_promocao: alistado.ultima_promocao,
                    promovido_por: alistado.promovido_por,
                    status: alistado.status,
                    siglas: (sigla ? sigla : 'Nenhuma')
                }


                return res.json({ auth: true, resultado: dados })
            } else {
                return res.status(400).json({ error: true, message: 'Militar não encontrado' })
            }
        } else {
            return res.status(400).json({ error: true, message: 'Você precisa fornecer o nome do militar' })
        }
    }

}

export default SiteController