import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [posts, setPosts] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [tituloEditado, setTituloEditado] = useState('');
  const [conteudoEditado, setConteudoEditado] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  // Buscar posts
  useEffect(() => {
    axios.get('http://localhost:3001/posts')
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar os posts:', error);
      });
  }, []);

  // Criar novo post
  const handleCriarPost = (e) => {
    e.preventDefault();

    axios.post('http://localhost:3001/posts', { titulo, conteudo })
      .then((response) => {
        setPosts([...posts, response.data]);  // Adiciona o post criado à lista
        setTitulo(''); // Limpa o campo título
        setConteudo(''); // Limpa o campo conteúdo
      })
      .catch((error) => {
        console.error('Erro ao criar o post:', error);
      });
  };

  const  handleLogin = (e) => {
    e.preventDefault();
    
    axios.post('http://localhost:3001/login', { email, senha })
      .then((response) => {
        setMensagem(response.data.message);
      })
      .catch((err) => {
        setMensagem(err.response.data.message);
      })
  }

  const salvarEdicao = (id) => {
    axios.put(`http://localhost:3001/posts/${id}`, {
      titulo: tituloEditado,
      conteudo: conteudoEditado
    }).then(response => {
      setPosts(posts.map(p => p.id === id ? response.data : p))
      setEditandoId(null);
    }).catch(err => {
      console.error('Erro ao editar post', err);
    });
  }

  const deletePost = (id) => {
    axios.delete(`http://localhost:3001/posts/${id}`)
      .then(() => {
        setPosts(posts.filter(p => p.id !== id));
      })
      .catch((err) => {
        console.error("Erro ao deletar:", err);
      })
  }

  return (
    <div>
      <h1>Blog</h1>


      <div>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <button type="submit">Entrar</button>
        </form>
        {mensagem && <p>{mensagem}</p>}
      </div>

      {/* Formulário para criar um novo post */}
      <form onSubmit={handleCriarPost}>
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <textarea
          placeholder="Conteúdo"
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          required
        />
        <button type="submit">Criar Post</button>
      </form>

      {/* Listar posts */}<ul>
        {posts.length === 0 ? (
          <p>Nenhum post encontrado.</p>
        ) : (
          posts.map((post) => (
            <li key={post.id}>
              {editandoId === post.id ? (
                <>
                  <input
                    value={tituloEditado}
                    onChange={(e) => setTituloEditado(e.target.value)}
                  />
                  <textarea
                    value={conteudoEditado}
                    onChange={(e) => setConteudoEditado(e.target.value)}
                  />
                  <button onClick={() => salvarEdicao(post.id)}>Salvar</button>
                  <button onClick={() => setEditandoId(null)}>Cancelar</button>
                </>
              ) : (
                <>
                  <h2>{post.titulo}</h2>
                  <p>{post.conteudo}</p>
                  <button onClick={() => {
                    setEditandoId(post.id);
                    setTituloEditado(post.titulo);
                    setConteudoEditado(post.conteudo);
                  }}>Editar</button>
                  <button onClick={() => deletePost(post.id)}>Excluir</button>
                </>
              )}
            </li>
          ))
        )}
      </ul>


    </div>
  );
}

export default App;
