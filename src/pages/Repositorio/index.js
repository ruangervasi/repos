import React, { useState, useEffect } from 'react';
import { Container, Owner, Loading, BackButton, IssuesList, PageActions, StateIssues } from './styles';
import api from '../../services/api';
import {FaArrowLeft} from 'react-icons/fa';

export default function Repositorio({match}) {


const [repositorio, setRepositorio] = useState({});
const [issues, setIssues] = useState([]);
const [loading, setLoading] = useState(true);
const [page, setPage] = useState(1);
const [stateIssues, setStateIssues] = useState([
    {state: 'all', label: 'Todas', active: true},
    {state: 'open', label: 'Abertas', active: false},
    {state: 'closed', label: 'Fechadas', active: false},
]);
const [filterIndex, setFilterIndex] = useState(0);

useEffect(() => {
    async function load(){
        const nomeRepo = decodeURIComponent(match.params.repositorio);
    
        
        const [repositorioData, issuesData] = await Promise.all([
                api.get(`/repos/${nomeRepo}`),
                api.get(`/repos/${nomeRepo}/issues`, {
                        params: {
                                state: stateIssues.find(f => f.active).state,
                                per_page: 5,
                                page: page
                        }
                })
        ])
    
        setRepositorio(repositorioData.data);
        setIssues(issuesData.data);
        setLoading(false);
    }
    load();
}, [match.params.repositorios]);

useEffect(() => {
    async function loadIssues(){
        const nomeRepo = decodeURIComponent(match.params.repositorio);
    
        
        const [issuesData] = await Promise.all([
                api.get(`/repos/${nomeRepo}/issues`, {
                        params: {
                                state: stateIssues[filterIndex].state,
                                per_page: 5,
                                page: page
                        }
                })
        ])
    
        setIssues(issuesData.data);
        setLoading(false);
    }
    loadIssues();
}, [match.params.repositorio, page, stateIssues, filterIndex]);


function handlePage(action){
    setPage(action === 'back' ? page -1 : page + 1);
}

function handleState(index){
    setFilterIndex(index)
}


if(loading){
    return(
    <Loading>
        <h1>Carregando...</h1>
    </Loading>
    )
}

return (
    <Container>
            <BackButton to="/">
                <FaArrowLeft color="#000" size={30}/>
            </BackButton>
            <Owner>
                <img src={repositorio.owner.avatar_url} alt={repositorio.owner.login}/>
                <h1>{repositorio.name}</h1>
                <p>{repositorio.description}</p>
            </Owner>

            <StateIssues active={filterIndex}>
                {stateIssues.map((filter, index) => (
                    <button type="button" key={filter.label} onClick={()=> handleState(index)}>
                        {filter.label}
                    </button>
                ))}
            </StateIssues>

            <IssuesList>
                {issues.map(issue =>(
                    <li key={String(issue.id)}>
                        <img src={issue.user.avatar_url} alt={issue.user.login}/>
                        <div>
                            <strong>
                                <a href={issue.html_url}>{issue.title}</a>

                                {issue.labels.map(label =>(
                                    <span key={String(label.id)}>{label.name}</span>
                                ))}
                            </strong>
                            <p>{issue.user.login}</p>
                        </div>
                    </li>      
                ))}
            </IssuesList>

            <PageActions>
                <button type="button" onClick={() => handlePage('back')} disabled={page < 2}>Anterior</button>
                <button type="button" onClick={() => handlePage('next')}>Próxima</button>
            </PageActions>
    </Container>
)
}