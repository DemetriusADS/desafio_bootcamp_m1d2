import React, {useState, useEffect} from "react";
import { FiThumbsUp } from 'react-icons/fi';
import api from './services/api';

import "./styles.css";

function App() {
  const [repositories, setRespositories] = useState([]);

  useEffect(()=>{
    api.get('/repositories').then(repository=>{
      setRespositories(repository.data);
    }
    );
  }, []);
  async function handleAddRepository() {
    const result = await api.post('/repositories',{
      title:"Desafio ReactJS",
      url:"github.com/DemetriusADS",
      techs:["nodejs","reactjs"]
    });

    const repository = result.data;

    setRespositories([...repositories, repository]);
  }

  async function handleRemoveRepository(id) {
    await api.delete(`/repositories/${id}`);

    const newRepo = repositories.filter(repository => repository.id !== id);

    setRespositories(newRepo);
  }

  async function handleLikesRepository(id){
    const liked = await api.post(`/repositories/${id}/like`);

    const likedIndex = repositories.findIndex(repository => repository.id === id);
    
    const refreshLikes = [...repositories];

    refreshLikes[likedIndex].likes = liked.data.likes;

    setRespositories(refreshLikes);
  }

  return (
    <div className="container">
      <ul data-testid="repository-list">
        {repositories.map((repository)=>
            <li key={repository.id}>
              <div className="container-inner">
                <h3>Titulo: {repository.title}</h3>
                <h3>Url: <a href={repository.url}>{repository.url}</a></h3>
                <h3>Techs: {repository.techs.map(techs=>`#${techs} `)}</h3>
                <div className="likes">
                  <button className="likeButton" onClick={()=>handleLikesRepository(repository.id)}>
                    <FiThumbsUp size={15}/>
                  </button>
                  <span>{repository.likes}</span>
                </div>
                
                <button onClick={() => handleRemoveRepository(repository.id)}>
                  Remover
                </button>
              </div>
            </li>
        )}
        
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
