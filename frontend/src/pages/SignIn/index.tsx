import React, { useCallback } from 'react';
import { Form } from '@unform/web';

import { useAuth } from '../../hooks/auth';

import logo from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container } from './styles';

const SignIn: React.FC = () => {
  const { signIn } = useAuth();

  const handleSubmit = useCallback(
    async data => {
      const { login, password } = data;

      await signIn({ login, password });
    },
    [signIn],
  );

  return (
    <Container>
      <img src={logo} alt="Repik" />
      <Form onSubmit={handleSubmit}>
        <Input placeholder="E-mail or username" type="text" name="login" />
        <Input placeholder="Password" type="password" name="password" />
        <Button type="submit">Login</Button>
      </Form>
    </Container>
  );
};

export default SignIn;
