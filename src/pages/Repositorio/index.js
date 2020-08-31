import React from 'react';
import { Container } from './styles';
import { Link } from 'react-router-dom';

export default function Repositorio({match}) {
        return (
                <Container>
                        Repositorio: <span>{decodeURIComponent(match.params.repositorio)}</span>
                        
                </Container>
        )
}

