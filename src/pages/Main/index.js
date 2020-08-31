import React, { useState, useCallback, useEffect } from 'react';
import { FaGithub,FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa';
import { Container, Form, SubmitButton, List, DeleteButton } from './styles';
import { Link } from 'react-router-dom';

import api from '../../services/api';

export default function Main() {

    const [newRepo, setNewRepo] = useState('');
    const [repositorios, setRepositorios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    // equivalente ao ComponentDidMount - Buscar no inicio da tela
    useEffect(() => {
        const repoStorage = localStorage.getItem('repositorios');
        
        if(repoStorage){        
            setRepositorios(JSON.parse(repoStorage));
        }
    },[]);

    //Equivalente ao ComponentDidUpdate - Salvar Alterações
    useEffect(() => {
        localStorage.setItem('repositorios', JSON.stringify(repositorios));
    }, [repositorios]);


    const handleSubmit = useCallback((e)=>{
        e.preventDefault();

        async function submit(){
            setLoading(true);
            setAlert(null);
            try{

                if(newRepo === ''){
                    throw new Error('Por favor, preencha os campos necessários!');
                }

                const response = await api.get(`repos/${newRepo}`,{ 
                    auth: { user: "ruan@ruangervasi.com.br", password: "91421329" }
                });

                const hasRepo = repositorios.find(repo => repo.name.toUpperCase() === newRepo.toUpperCase())

                if(hasRepo){
                    throw new Error('Repositório já inserido!');
                }

                const data = {
                    name: response.data.full_name,
                }
                
                setRepositorios([...repositorios, data]);
                setNewRepo('');
            }
            catch(error){
                setAlert(true);
                console.log(error);
            }
            finally{
                setLoading(false);
            }
        }

        submit();
    }, [newRepo, repositorios]);

    function handleInputChange(e) {
        setNewRepo(e.target.value);
        setAlert(null);
    }

    const handleDelete = useCallback((repo) => {
        const find = repositorios.filter(r => r.name !== repo)
        setRepositorios(find);
    }, [repositorios]);

        return (
            <Container>
                <h1>
                    <FaGithub size={25}/>
                    Meus Repositórios
                </h1>

                <Form onSubmit={handleSubmit} error={alert}>
                    <input type="text" placeholder="Adicionar Repositórios"
                    value={newRepo} 
                    onChange={handleInputChange}
                    />
                    <SubmitButton Loading={loading ? 1 : 0}>
                        {loading ? (
                            <FaSpinner color="#FFF"/>
                        ) : (
                            <FaPlus color="#FFF" size={14}/>
                        )}

                    </SubmitButton>
                </Form>
                <List>
                    {repositorios.map(repo => (
                            <li key={repo.name}>
                                <span>
                                    <DeleteButton onClick={() => handleDelete(repo.name)}>
                                        <FaTrash size={14}/>
                                    </DeleteButton>
                                    {repo.name}
                                </span>
                                <Link to={`/repositorio/${encodeURIComponent(repo.name)}`}>
                                    <FaBars size={20}/>
                                </Link>
                            </li>
                        ))
                    }
                </List>
            </Container>
        );
}