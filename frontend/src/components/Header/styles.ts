import styled from 'styled-components';
import { shade } from 'polished';

import InputComponent from '../Input';

export const Container = styled.header`
  position: fixed;
  background: #344653;
  width: 100vw;
  height: 115px;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  border-bottom: 5px solid #45cb84;
  z-index: 999;
`;

export const Content = styled.div`
  max-width: 1440px;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;

  img {
    width: 60px;
  }

  form {
    display: flex;
    align-items: center;

    button {
      width: 90px;
      height: 40px;
      margin-top: auto;
      border-radius: 10px;
      background: #45cb84;
      font-size: 16px;

      &:hover {
        background: ${shade(0.15, '#45cb84')};
      }
    }
  }
`;

export const Input = styled(InputComponent)`
  background: #fff;
  height: 40px;
  width: 280px;
  border-radius: 10px;
  margin-right: 10px;

  input {
    color: #333;
  }

  input::placeholder {
    color: #676a6c;
  }
`;
