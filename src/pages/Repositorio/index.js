import React, { useState, useEffect } from 'react';
import { Container } from './styles';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function Repositorio({match}) {

        useEffect(() => {
                async function load(){
                        const nomeRepo = decodeURIComponent(match.params.repositorio);

                        const [repositorioData, issuesData] = await Promise.all([
                                api.get(`/repos/${nomeRepo}`),
                                api.get(`/repos/${nomeRepo}/issues`)
                        ])

                        console.log(repositorioData);
                        console.log(issuesData);
                }
                load();
        }, []);

        

        return (
                <Container>
                        Repositorio: <span>{decodeURIComponent(match.params.repositorio)}</span>
                </Container>
        )
}

