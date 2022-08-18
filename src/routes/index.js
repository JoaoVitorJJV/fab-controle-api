import express from 'express'
import verifyJWT from "../config/jwtVerift.js";
import verifyCentral from '../config/verifyCentral.js';
import AlistadoController from '../controllers/AlistadosController.js';
import AuthController from "../controllers/AuthController.js";
import CentralController from '../controllers/CentralController.js';
import HomeController from '../controllers/HomeController.js';
import LogsController from '../controllers/LogsController.js';
import OficiaisController from '../controllers/OficiaisController.js';
import PostsController from '../controllers/PostsController.js';
import SiteController from '../controllers/SiteController.js';
import TreinamentosController from '../controllers/TreinamentosController.js';


const router = express.Router()


router.get('/', (req, res) => {
    res.json({message: 'Server init'})
})

router.get('/ping', (req, res) => {
    res.json('Pong')
})
// router.get('/alistados', HomeController.pegarTodosAlistados)
router.get('/usuarios', verifyJWT, HomeController.getUsuarios)
router.get('/patentes-praca', HomeController.getPatentesPracaFab)
router.get('/patentes/todas', HomeController.getAllPatentes)
router.get('/usuario', HomeController.getInfoPerfil)
router.get('/metas', verifyJWT, HomeController.getMetas)

//Auth
router.post('/cadastrar', AuthController.cadastro)
router.post('/login', AuthController.login)
router.post('/validate', AuthController.validateToken)
router.post('/signout', AuthController.signout)
router.post('/alterar-senha', verifyJWT, AuthController.changeSenha)
// router.options('/validateToken2', AuthController.validateTokenOpt)

//Alistados
router.get('/alistados/registro', AlistadoController.getRegistro)
router.get('/alistados/patente', AlistadoController.getPatNome)
router.get('/alistados', verifyJWT, AlistadoController.getAlistados)

//Geral
router.get('/patentes', HomeController.getPatentesFab)

//Oficiais
router.get('/fab/usuarios-e-patentes',verifyJWT, OficiaisController.oficiaisEPatentes)
router.post('/inserir-alistado', verifyJWT, OficiaisController.inserirAlistado)
router.post('/oficiais/ac/criar-usuario', verifyJWT, OficiaisController.criarUsuario)
router.get('/usuario/editar', verifyJWT, OficiaisController.getUsuarioNome)
router.post('/editar-usuario', verifyJWT, OficiaisController.editarUsuario)
router.post('/bloquear', verifyJWT, OficiaisController.bloquearUsuario)
router.post('/opniao', verifyJWT, OficiaisController.giveOpniao)
router.get('/siglas', verifyJWT, OficiaisController.getSiglas)
router.post('/siglas/inserir', verifyJWT, OficiaisController.inserirSigla)
router.post('/siglas/remover', verifyJWT, OficiaisController.removerSigla)
router.post('/usuarios/deletar', verifyJWT, OficiaisController.deleteUsuario)
router.post('/slides/criar', verifyJWT, OficiaisController.criarSlide)
router.get('/slides', OficiaisController.getSlides)
router.post('/slides/trocar-posicao', verifyJWT, OficiaisController.trocarPosicaoSlide)
router.get('/slide', verifyJWT, OficiaisController.getSlideID)
router.post('/slide/editar', verifyJWT, OficiaisController.editSlide)
router.post('/slide/excluir', verifyJWT, OficiaisController.excluirSlide)

//Central
router.get('/fab/relatorios', verifyJWT, CentralController.getAllRelatorios)
router.post('/fazer-relatorio', verifyJWT, CentralController.createRelatorio)
router.post('/editar-relatorio', verifyJWT, CentralController.editRelatorio)
router.post('/exluir-relatorio', verifyJWT, CentralController.deleteRel)
router.get('/central', verifyCentral, CentralController.getRelatorios)
router.get('/central/app', verifyJWT, CentralController.getRelatorios)
router.post('/central/aceitar', verifyJWT, CentralController.aceitarRelatorio)

//Treinamentos
router.get('/treinos', TreinamentosController.getTreinamentos)
router.get('/relatorio/usuario', TreinamentosController.getRelatoriosUsuario)

//Site
router.post('/definir-destaques', verifyJWT, SiteController.createDestaque)
router.get('/destaques', SiteController.getDestaques)
router.post('/editar-destaques', verifyJWT, SiteController.editDestaque)
router.get('/destaque', verifyJWT, SiteController.getDestaqueNome)
router.post('/criar-aviso', verifyJWT, SiteController.createAviso)
router.get('/avisos', SiteController.getAvisos)
router.get('/avisos/painel', SiteController.getAvisosPainel)
router.get('/aviso', SiteController.getAvisoID)
router.post('/editar-aviso', verifyJWT, SiteController.editarAviso)
router.get('/ultimos-alistados', SiteController.getUltimosAlitos)
router.get('/alistado', SiteController.pesquisaMilitar)

//Posts
router.post('/posts/criar', verifyJWT, PostsController.createPost)
router.post('/posts/excluir', verifyJWT, PostsController.destroyPost)
router.get('/posts', verifyJWT, PostsController.getAllPosts)
router.get('/post', verifyJWT, PostsController.getPostIdUSer)
router.get('/posts/like', verifyJWT, PostsController.createOrDestroyLike)
router.get('/posts/likes', verifyJWT, PostsController.getLikesPost)
router.post('/post/comentar', verifyJWT, PostsController.createComentario)

//Logs
router.get('/logs', verifyJWT, LogsController.getLogs)



export default router;
