import React from 'react';

import { Container } from './styles';

interface ListItemProps {
  children: React.ReactElement;
}

const ListItem: React.FC<ListItemProps> = ({ children }) => {
  return <Container>{children}</Container>;
};

export default ListItem;
