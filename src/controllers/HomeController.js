import { Op } from "sequelize";
import { Alistados, 
    Central, 
    Opnioes, 
    Patentes, 
    Posts, 
    SiteDestaques, 
    Usuarios, 
    PostsLikes,
    PostsComentarios
 } from "../models/Models.js";

class HomeController {
    static getPatentesFab = async (req, res) => {
        const inst = req.query.ex
        const patAtual = req.query.pat || 10


        var patentes;

        switch (parseInt(patAtual)) {
            case 10: {
                patentes = await Patentes.findAll({
                    where: {
                        instituicao: inst
                    },
                    limit: 2
                })
            }
                break;
            case 11: {
                patentes = await Patentes.findAll({
                    where: {
                        instituicao: inst
                    },
                    limit: 3
                })
            }
                break;
            case 12: {
                patentes = await Patentes.findAll({
                    where: {
                        instituicao: inst
                    },
                    limit: 4
                })
            }
                break;
            case 13: {
                patentes = await Patentes.findAll({
                    where: {
                        instituicao: inst
                    },
                    limit: 5
                })
            }
                break;
            case 14: {
                patentes = await Patentes.findAll({
                    where: {
                        instituicao: inst
                    },
                    limit: 6
                })
            }
                break;
            case 15: {
                patentes = await Patentes.findAll({
                    where: {
                        instituicao: inst
                    },
                    limit: 9
                })
            }
                break;
            case 16: {
                patentes = await Patentes.findAll({
                    where: {
                        instituicao: inst
                    },
                    limit: 10
                })
            }
                break;
            case 17: {
                patentes = await Patentes.findAll({
                    where: {
                        instituicao: inst
                    },
                    limit: 11
                })
            }
                break;
            case 18: {
                patentes = await Patentes.findAll({
                    where: {
                        instituicao: inst
                    },
                    limit: 12
                })
            }
                break;
            case 19: {
                patentes = await Patentes.findAll({
                    where: {
                        instituicao: inst
                    },
                    limit: 13
                })
            }
                break;
            case 20: {
                patentes = await Patentes.findAll({
                    where: {
                        instituicao: inst
                    }
                })
            }
                break;
        }

        res.json({ auth: true, patentes })
    }

    static getPatentesPracaFab = async (req, res) => {
        const patentes = await Patentes.findAll({
            where: {
                tipo: 'praca'
            }
        })

        res.json({ auth: true, patentes })
    }

    static getAllPatentes = async (req, res) => {
        const patentes = await Patentes.findAll({
            order: [
                ["id", "ASC"]
            ]
        })

        res.json({ auth: true, patentes })
    }

    static getUsuarios = async (req, res, next) => {
        const usuarios = await Usuarios.findAll({
            order: [
                ["id", "DESC"]
            ],
            where: {
                id: {
                    [Op.ne]: 2
                }
            }
        })

        var arrayUsers = []

        if (usuarios) {
            const res = await Promise.all(usuarios.map(async (usuario, i) => {

                const patente = await Patentes.findOne({
                    where: {
                        id: usuario.pat_id
                    }
                })
                arrayUsers[i] = {
                    nome: usuario.nickname,
                    patente: patente.nome_sem_estrela,
                    status: usuario.status
                }
            }))
        }


        res.json({ auth: true, usuarios: arrayUsers })
    }

    static getInfoPerfil = async (req, res, next) => {
        const nomeUsuario = req.query.nome;

        if (nomeUsuario) {
            const usuario = await Usuarios.findOne({
                where: {
                    nickname: nomeUsuario
                }
            })

            if (usuario) {
                const id = usuario.id

                const relatorios = await Central.count({
                    where: {
                        user_id: id
                    }
                })

                const ultimoAlistamento = await Alistados.findOne({
                    attributes: ['ultima_promocao'],
                    where: {
                        nickname: nomeUsuario
                    }
                })

                const opnioes = await Opnioes.findAll({
                    where: {
                        id_usuario: id,

                    },
                    limit: 5
                })

                const qtdPosts = await Posts.count({
                    where: {
                        nome_usuario: nomeUsuario
                    }
                })

                var dados = []

                const posts = await Posts.findAll({
                    where: {
                        nome_usuario: nomeUsuario
                    }
                })
                if (posts) {
                    await Promise.all(posts.map(async (post, i) => {

                        const likes = await PostsLikes.count({
                            where: {
                                id_post: post.id
                            }
                        })

                        const comentariosQTD = await PostsComentarios.count({
                            where: {
                                id_post: post.id
                            }
                        })

                        dados[i] = {
                            id: post.id,
                            id_usuario: post.id,
                            patente: post.patente,
                            datetime: post.datetime,
                            texto: post.texto,
                            nome_usuario: post.nome_usuario,
                            likes,
                            comentariosQTD
                        }
                    }))
                }

                return res.json({ 
                    auth: true, relatorios, 
                    ultimoAlistamento: ultimoAlistamento.ultima_promocao, 
                    opnioes, 
                    dados ,
                    qtdPosts
                })


            }
        }


        return res.json({ auth: false, msg: 'Usuário não encontrado.' })
    }

    static getMetas = async (req, res, next) => {
        var dateObj = new Date();
        var dias = {
            hoje: {
                UTC: new Date(`${dateObj}+0300`),
                dia_numero: ''
            },
            dia1: {
                UTC: new Date(`${dateObj}+0300`),
                dia_numero: ''
            },
            dia2: {
                UTC: new Date(`${dateObj}+0300`),
                dia_numero: ''
            },
            dia3: {
                UTC: new Date(`${dateObj}+0300`),
                dia_numero: ''
            },
            dia4: {
                UTC: new Date(`${dateObj}+0300`),
                dia_numero: ''
            },
            dia5: {
                UTC: new Date(`${dateObj}+0300`),
                dia_numero: ''
            },
            dia6: {
                UTC: new Date(`${dateObj}+0300`),
                dia_numero: ''
            },
            dia7: {
                UTC: new Date(`${dateObj}+0300`),
                dia_numero: ''
            }
        }

        var dados = []
        var datas = []
        var treinamentos = []

        var hoje = new Date(`${dateObj}+0300`)

        var hojeFormatado = hoje.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

        dias.dia1.dia_numero = dias.dia1.UTC.setDate(dias.dia1.UTC.getDate() - 1);
        dias.dia2.dia_numero = dias.dia2.UTC.setDate(dias.dia2.UTC.getDate() - 2);
        dias.dia3.dia_numero = dias.dia3.UTC.setDate(dias.dia3.UTC.getDate() - 3);
        dias.dia4.dia_numero = dias.dia4.UTC.setDate(dias.dia4.UTC.getDate() - 4);
        dias.dia5.dia_numero = dias.dia5.UTC.setDate(dias.dia5.UTC.getDate() - 5);
        dias.dia6.dia_numero = dias.dia6.UTC.setDate(dias.dia6.UTC.getDate() - 6);
        dias.dia7.dia_numero = dias.dia7.UTC.setDate(dias.dia7.UTC.getDate() - 7);


        Object.keys(dias).forEach(async (item, i) => {
            var data2 = dias[item].UTC.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

            datas[i] = {
                dia: data2
            }


        })

        await Promise.all(datas.map(async (dia, i) => {
            const result = await Alistados.count({
                where: {
                    registro_data: dia.dia
                }
            })

            const T1 = await Central.count({
                where: {
                    data_envio: dia.dia,
                    treino: 'Instrução Básica Militar'
                }
            })

            const T2 = await Central.count({
                where: {
                    data_envio: dia.dia,
                    treino: 'Instrução Intermediária Militar'
                }
            })

            const T3 = await Central.count({
                where: {
                    data_envio: dia.dia,
                    treino: 'Treinamento Complementar I'
                }
            })

            const T4 = await Central.count({
                where: {
                    data_envio: dia.dia,
                    treino: 'Treinamento Complementar II'
                }
            })


            dados[i] = {
                dia: dia.dia,
                alistados: result
            }

            treinamentos[i] = {
                dia: dia.dia,
                treinos: {
                    basicoI: T1,
                    basicoII: T2,
                    basicoIII: T3,
                    basicoIV: T4
                }
            }
        }))



        const alistadosHoje = await Alistados.count({
            where: {
                registro_data: hojeFormatado
            }
        })

        const T1Hoje = await Central.count({
            where: {
                data_envio: hojeFormatado,
                treino: 'Instrução Básica Militar'
            }
        })

        const T2Hoje = await Central.count({
            where: {
                data_envio: hojeFormatado,
                treino: 'Instrução Intermediária Militar'
            }
        })

        const T3hoje = await Central.count({
            where: {
                data_envio: hojeFormatado,
                treino: 'Treinamento Complementar I'
            }
        })

        const T4hoje = await Central.count({
            where: {
                data_envio: hojeFormatado,
                treino: 'Treinamento Complementar II'
            }
        })

        const alitadosTotais = await Alistados.count({})

        const hojeMetas = {
            alistadosHoje, T1Hoje, T2Hoje, T3hoje, T4hoje
        }

        const pracaDestaque = await SiteDestaques.findOne({
            where: {
                tipo: 'praca'
            }
        })

        const oficialDestaque = await SiteDestaques.findOne({
            where: {
                tipo: 'oficial'
            }
        })
        res.json({ 
            auth: true, 
            alistados: dados, 
            treinamentos, 
            hojeMetas, 
            alitadosTotais, 
            pracaDestaque: pracaDestaque.nome, 
            oficialDestaque: oficialDestaque.nome 
        })
    }


}

export default HomeController