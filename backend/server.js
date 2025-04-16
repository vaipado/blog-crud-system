const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');
const app = express();
const port = 3001;

app.use(cors());

app.use(bodyParser.json());

app.get('/posts', (req, res) => {
    db.query('SELECT * from posts', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results)
    })
})

app.post('/posts', verificarAdmin, (req, res) => {
    const { titulo, conteudo } = req.body
    const sql = 'INSERT INTO posts (titulo, conteudo)  VALUES (?, ?)';
    db.query(sql, [titulo, conteudo], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({
            id: results.insertId, titulo, conteudo
        })
    })
})

app.put('/posts/:id', verificarAdmin, (req, res) => {
    const { id } = req.params;
    const { titulo, conteudo } = req.body;
    const sql = 'UPDATE posts SET titulo = ?, conteudo = ? WHERE id = ?';
    db.query(sql, [titulo, conteudo, id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ id, titulo, conteudo });
    });
});

app.delete('/posts/:id', verificarAdmin, (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM posts WHERE id=?';
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.sendStatus(204);
    })
});

// Alterando a rota de login para retornar o userId ao invés de usar session
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const sql = 'SELECT * FROM usuarios WHERE email = ?';

    db.query(sql, [email], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length === 0) {
            return res.status(401).json({ message: 'Email ou senha incorretos' });
        }

        const usuario = result[0];
        if (usuario.senha === senha) {
            // Enviar apenas o ID do usuário, já que o frontend vai armazenar esse ID no LocalStorage
            return res.json({ message: 'Login bem-sucedido', userId: usuario.id });
        }

        return res.status(401).json({ message: 'Email ou senha incorretos' });
    });
});

// Função de verificação do admin

function verificarAdmin(req, res, next) {
    const userId = req.headers['userid']; // tudo minúsculo

    if (!userId) {
        return res.status(401).json({ message: 'Precisa estar logado para criar um post' });
    }

    // Verifica se o usuário existe no banco de dados
    db.query('SELECT * FROM usuarios WHERE id =?', [userId], (err, results) => {
        if (err) return res.status(500).send(err);

        if (results.length === 0) {
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        // Se o usuário existe, você pode checar a permissão de admin (ajuste conforme necessário)
        // Por exemplo, se a tabela tiver uma coluna 'admin', a verificação seria assim:
        // if (results[0].admin) {
        next();  // Permite o acesso
        // } else {
        //     return res.status(403).json({ message: 'Permissão negada' });
        // }
    });
}


app.listen(port, () => {
    console.log(`Server rodando em http://localhost:${port}`);
});
