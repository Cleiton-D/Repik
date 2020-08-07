import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.button`
  height: 45px;
  border: 0;
  margin-top: 30px;
  background: #22b7a6;
  border-radius: 5px;
  color: #fff;
  font-weight: bold;
  font-size: 20px;
  transition: background 0.2s;

  &:hover {
    background: ${shade(0.15, '#22b7a6')};
  }
`;
