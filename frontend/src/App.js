import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [posts, setPosts] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [logado, setLogado] = useState(false);

  useEffect(() => {
    // Checar se o usuário está logado
    const userId = localStorage.getItem('userId');

    if (userId) {
      setLogado(true); // Usuário está logado
      // Carregar posts
      axios.get('http://localhost:3001/posts')
        .then(response => setPosts(response.data))
        .catch(error => console.error('Erro ao buscar posts', error));
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    axios.post('http://localhost:3001/login', { email, senha })
      .then(response => {
        setMensagem(response.data.message);
        localStorage.setItem('userId', response.data.userId); // Armazenando userId no LocalStorage
        setLogado(true);
      })
      .catch(err => {
        setMensagem(err.response.data.message);
      });
  };

  const handleCriarPost = (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId');
    console.log('UserID no frontend:', userId); // <-- Aqui!
    if (!userId) {
      setMensagem('Você precisa estar logado para criar um post');
      return;
    }

    axios.post('http://localhost:3001/posts', { titulo, conteudo }, { headers: { userId } })
      .then(response => {
        setPosts([...posts, response.data]);
        setTitulo('');
        setConteudo('');
      })
      .catch(err => console.error('Erro ao criar o post bla bla:', err));
  };

  const handleLogout = () => {
    localStorage.removeItem('userId'); // Remover o userId do LocalStorage
    setLogado(false); // Atualizar o estado
    setPosts([]); // Opcional: Limpar posts ao fazer logout
  };

  return (
    <div>
      <h1>Blog</h1>

      {!logado ? (
        <div>
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
            <button type="submit">Entrar</button>
          </form>
          {mensagem && <p>{mensagem}</p>}
        </div>
      ) : (
        <div>
          <button onClick={handleLogout}>Sair</button>
          <form onSubmit={handleCriarPost}>
            <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Título" />
            <textarea value={conteudo} onChange={(e) => setConteudo(e.target.value)} placeholder="Conteúdo"></textarea>
            <button type="submit">Criar Post</button>
          </form>

          <ul>
            {posts.map(post => (
              <li key={post.id}>
                <h3>{post.titulo}</h3>
                <p>{post.conteudo}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>

    
  );
}

export default App;
