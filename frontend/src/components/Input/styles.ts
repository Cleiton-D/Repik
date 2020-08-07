import styled from 'styled-components';

export const Container = styled.div`
  background: rgba(255, 255, 255, 0.35);
  border-radius: 5px;
  padding: 15px;
  width: 100%;
  color: #fff;

  display: flex;
  align-items: center;

  & + div {
    margin-top: 20px;
  }

  input {
    background: transparent;
    flex: 1;
    border: 0;
    color: #fff;

    &::placeholder {
      color: #c6c6c6;
    }
  }
`;
