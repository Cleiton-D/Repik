import styled from 'styled-components';

export const Container = styled.div`
  background: #344653;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
    width: 126px;
    height: 162px;
  }

  form {
    max-width: 340px;
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    width: 100%;
  }
`;
