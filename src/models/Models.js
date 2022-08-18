import instance from "../config/conn.js";
import { DataTypes } from "sequelize";

export const Alistados = instance.define('alistados', {

    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    nickname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    patente_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    registro: {
        type: DataTypes.DATE,
        allowNull: false
    },
    promovido_por: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ultima_promocao: {
        type: DataTypes.DATE,
        allowNull:false
    },
    status: {
        type: DataTypes.ENUM('Ativo','Demitido - Traição', 'Demitido - Mau Comportamento', 'Demitido - Sem volta'),
        allowNull: false
    },
    registro_data: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
{
    createdAt: false,
    updatedAt: false
})

export const Central = instance.define('central', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    data_envio: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ip: {
        type: DataTypes.STRING,
        allowNull: false
    },
    relatorio: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('Aguardando Correção', 'Corrigido', 'Relatório de Teste'),
        allowNull: true
    },
    resp_nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    trei_nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    trei_patente: {
        type: DataTypes.STRING,
        allowNull:false
    },
    aux_nome: {
        type: DataTypes.STRING,
        allowNull: true
    },
    treino: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sala: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hora_inicio: {
        type: DataTypes.TIME,
        allowNull: false
    },
    hora_final: {
        type: DataTypes.TIME,
        allowNull: false
    },
    inicio_qtd: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    inicio_nomes: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sem_aprovados: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    observacoes: {
        type: DataTypes.STRING,
        allowNull: true
    },
    oficial_verificou: {
        type: DataTypes.STRING,
        allowNull: true
    },
    erros: {
        type: DataTypes.TINYINT,
        allowNull: true
    },
    aprovados: {
        type: DataTypes.STRING,
        allowNull: true
    },
    aux_patente: {
        type: DataTypes.STRING,
        allowNull: true
    },
    usuario: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pat_treinados: {
        type: DataTypes.STRING,
        allowNull: true
    },
    data_hora_envio: {
        type: DataTypes.DATE,
        allowNull: false
    },
    reprovados: {
        type: DataTypes.STRING,
        allowNull: true
    },
    final_qtd: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
},
{
    createdAt: false,
    updatedAt: false,
    tableName: 'central'
})

export const Patentes = instance.define('patentes', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    pat_nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nome_sem_estrela: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo: {
        type: DataTypes.ENUM('praca', 'oficial'),
        allowNull: false
    }
},
{
    createdAt: false,
    updatedAt: false
})

export const Usuarios = instance.define('usuarios', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    nickname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    adv: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0
    },
    adv_motivo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    pat_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tipo: {
        type: DataTypes.ENUM('praca', 'oficial'),
        allowNull: false
    }
},
{
    createdAt: false,
    updatedAt: false
})

export const Logs = instance.define('logs', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    usuario: {
        type: DataTypes.STRING,
        allowNull: false
    },
    acao: {
        type: DataTypes.STRING,
        allowNull: false
    },
    datetime: {
        type: DataTypes.DATE,
        allowNull: false
    }
},{
    createdAt: false,
    updatedAt: false
})

export const Treinamentos = instance.define('treinamentos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    qtd_sala: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    cor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sigla: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    createdAt: false,
    updatedAt: false
})

export const Opnioes = instance.define('opnioes', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nome_oficial: {
        type: DataTypes.STRING,
        allowNull: false
    },
    texto: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    createdAt: false,
    updatedAt: false
})

export const SiteDestaques = instance.define('site_destaques', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    patente: {
        type: DataTypes.STRING,
        allowNull: false
    },
    texto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo: {
        type: DataTypes.ENUM('praca', 'oficial'),
        allowNull: false
    },
    data: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    createdAt: false,
    updatedAt: false
})

export const Posts = instance.define('posts', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    patente: {
        type: DataTypes.STRING,
        allowNull: false
    },
    datetime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    texto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nome_usuario: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    createdAt: false,
    updatedAt: false
})


export const PostsComentarios = instance.define('posts_comentarios', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    id_post: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    texto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    datetime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    nome_usuario: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    createdAt: false,
    updatedAt: false
})

export const PostsLikes = instance.define('posts_likes', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    id_post: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    datetime: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    createdAt: false,
    updatedAt: false
})

export const SiteAvisos = instance.define('site_avisos', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    texto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo: {
        type: DataTypes.ENUM('Global', 'Novidades'),
        allowNull: false
    },
    datetime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    createdAt: false,
    updatedAt: false
})

export const SiglasUsuarios = instance.define('siglas_usuarios', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    id_usuario: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sigla: {
        type: DataTypes.STRING,
        allowNull: false
    },
    atribuido_em: {
        type: DataTypes.DATE,
        allowNull: false
    },
    id_sigla: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ordem: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    createdAt: false,
    updatedAt: false
})

export const SiglasPainel = instance.define('siglas_painel', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo: {
        type: DataTypes.ENUM('praca', 'oficial', 'ambos'),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('ativo', 'inativo'),
        allowNull: false
        
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ordem: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    a_partir_de: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    createdAt: false,
    updatedAt: false,
    tableName: 'siglas_painel'
})

export const SlidesSite = instance.define('slides_site', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    slide_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slide_alt: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slide_ordem: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    slide_url_a: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    createdAt: false,
    updatedAt: false,
    tableName: 'slides_site'
})