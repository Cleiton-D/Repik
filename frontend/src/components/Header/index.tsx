import React from 'react';
import { Form } from '@unform/web';

import logo from '../../assets/logo.svg';

import Button from '../Button';

import { Container, Content, Input } from './styles';

const Header: React.FC = () => {
  return (
    <Container>
      <Content>
        <img src={logo} alt="Repik" />
        <Form onSubmit={() => console.log('pesquisando')}>
          <Input name="search" placeholder="Pesquisar repositórios..." />
          <Button type="submit">Buscar</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Header;
