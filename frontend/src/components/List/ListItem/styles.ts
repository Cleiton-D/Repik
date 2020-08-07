import styled from 'styled-components';

export const Container = styled.li`
  width: 100%;
  height: 100px;
  background: #fff;
  border-radius: 5px;
  border-left: 7px solid #45cb84;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: box-shadow 0.2s;

  display: flex;
  align-items: center;

  & + li {
    margin-top: 20px;
  }

  &:hover {
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.3);
  }
`;
