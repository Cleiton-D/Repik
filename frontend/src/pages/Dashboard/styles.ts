import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
`;

export const Content = styled.div`
  max-width: 940px;
  width: 100%;
  display: flex;
`;

export const ListItem = styled(Link)`
  display: flex;
  height: 100%;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  padding: 15px 45px 15px 15px;

  div {
    display: flex;
    flex-direction: column;

    strong {
      font-size: 24px;
      font-weight: normal;
      color: #333;
    }

    span {
      font-size: 14px;
      color: #70787d;
      margin-top: 5px;
    }
  }

  > span {
    color: #70787d;
    display: flex;
    align-items: center;
    font-size: 14px;

    svg {
      margin-right: 5px;
    }
  }
`;
