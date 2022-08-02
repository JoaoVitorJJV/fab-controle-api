import { Patentes, Posts, PostsComentarios, PostsLikes, Usuarios } from "../models/Models.js"
import LogsController from "./LogsController.js";


class PostsController {
    static getDateTime = () => {
        let dataISO = new Date()
        const datetime = new Date(`${dataISO}+0300`).toISOString().slice(0, 19).replace('T', ' ');

        return datetime;
    }

    static createPost = async (req, res, next) => {
        const idUser = req.body.idUser
        const texto = req.body.txt

        if (idUser && texto) {
            const idInt = parseInt(idUser)
            const txt = texto.toString()



            const patenteUsuario = await Usuarios.findOne({
                where: {
                    id: idInt
                }
            })

            if (patenteUsuario) {
                const pat = await Patentes.findOne({
                    attributes: ['nome_sem_estrela'],
                    where: {
                        id: patenteUsuario.pat_id
                    }
                })

                const patNome = pat.nome_sem_estrela
                const datetime = this.getDateTime()



                LogsController.gerarLog(patenteUsuario.nickname, 'Fez um novo post no fórum', datetime)

                await Posts.create({
                    id_usuario: idUser,
                    patente: patNome,
                    datetime,
                    texto: txt,
                    nome_usuario: patenteUsuario.nickname
                })

                res.json({ auth: true })
            } else {
                res.json({ auth: false })
            }
        } else {
            res.json({ auth: false })
        }
    }

    static destroyPost = async (req, res, next) => {
        const idUser = req.body.idUser
        const idPost = req.body.postID

        if (idUser) {
            const usuario = await Usuarios.findOne({
                where: {
                    id: idUser
                }
            })

            if (usuario) {
                const datetime = this.getDateTime()
                const patID = usuario.pat_id

                const post = await Posts.findOne({
                    where: {
                        id: idPost
                    }
                })

                if (post) {
                    const postAuthor = post.id_usuario

                    if (postAuthor === idUser) {
                        await Posts.destroy({
                            where: {
                                id: idPost
                            }
                        })

                        LogsController.gerarLog(usuario.nickname, 'Apagou o seu post', datetime)
                        return res.json({ auth: true, msg: `Post apagado com sucesso` })
                    } else {
                        if (patID > 9) {
                            await Posts.destroy({
                                where: {
                                    id: idPost
                                }
                            })

                            const author = await Usuarios.findOne({
                                where: {
                                    id: post.id_usuario
                                }
                            })

                            LogsController.gerarLog(usuario.nickname, `Apagou o post do usuário ${author.nickname}`, datetime)
                            return res.json({ auth: true, msg: `Post apagado com sucesso` })
                        }else{
                            return res.json({auth: false, msg: `Você não tem permissão para apagar esse Post.`})
                        }


                    }

                }else{
                    return res.json({auth: false, msg: `Erro de servidor: POST#1`})
                }
            }else{
                return res.json({auth: false, msg: `Erro de servidor: POST#2`})
            }
        }else{
            return res.json({auth: false, msg: `Erro de servidor: POST#3`})
        }

    }

    static getAllPosts = async (req, res, next) => {
        const posts = await Posts.findAll({
            order: [
                ["id", "DESC"]
            ],
            limit: 10
        })

        var dados = []

        if(posts){
            await Promise.all(posts.map(async (post, i )=> {

                const likes = await PostsLikes.count({
                    where: {
                        id_post: post.id
                    }
                })

                const comentarios = await PostsComentarios.findAll({
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
                    comentarios,
                    comentariosQTD
                }
            }))
        }

        return res.json({auth: true, dados})
    }

    static getPostIdUSer = async (req, res, next) => {
        const id = req.query.idUser
        
        if(id){
            const result = await Posts.findOne({
                where: {
                    id_usuario: id
                }
            })

            return res.json({auth: true, post: result})
        }

        return res.json({auth: false})

    }

    static createOrDestroyLike = async (req, res, next) => {
        const idPost = req.query.idPost
        const idUsuario = req.query.idUsuario

        const post = await Posts.findOne({
            where:{
                id: idPost
            }
          
        })

        if(post){
            const verificarPost = await PostsLikes.findOne({
                where: {
                    id_post: idPost,
                    id_usuario: idUsuario
                }
            })
            const datetime = this.getDateTime()
            if(verificarPost){

                if(verificarPost.id_usuario == idUsuario){
                    await PostsLikes.destroy({
                        where: {
                            id: verificarPost.id
                        }
                    })
                }else{
                   
                    await PostsLikes.create({
                        id_post: idPost,
                        id_usuario: idUsuario,
                        datetime
                    })
                }
                                      
            }else{
                await PostsLikes.create({
                    id_post: idPost,
                    id_usuario: idUsuario,
                    datetime
                })
            }

   
            return res.json({auth: true})
        }
    }

    static getLikesPost = async (req, res, next) => {
        const idPost = req.query.idPost

        const post = await Posts.findOne({
            where: {
                id: idPost
            }
        })

        if(post) {
            const numeroLikes = await PostsLikes.count({
                where: {
                    id_post: idPost
                }
            })

            return res.json({auth: true, likes: numeroLikes})
        }else{
            return res.json({auth: false, msg: 'O Post não existe'})
        }
    }

    static createComentario = async (req, res, next) => {
        const idUser = req.body.idUser
        const idPost = req.body.idPost
        const texto = req.body.txt

        if(idUser && idPost && texto){
            const txt = texto.toString()

            const post = await Posts.findOne({
                where: {
                    id: idPost
                }
            })

            if(post){
                const datetime = this.getDateTime()
                const usuario = await Usuarios.findOne({
                    where: {
                        id: idUser
                    }
                })

          
                await PostsComentarios.create({
                    id_post: idPost,
                    id_usuario: idUser,
                    texto: txt,
                    datetime: datetime,
                    nome_usuario: usuario.nickname
                })

                LogsController.gerarLog(usuario.nickname, `Comentou no post de ${post.nome_usuario}`, datetime)
                return res.json({auth: true})
            }else{
                return res.json({auth: false, msg: 'Post não encontrado.'})
            }
        }else{
            return res.json({auth: false, msg: 'Erro interno.'})
        }
    }
}

export default PostsController