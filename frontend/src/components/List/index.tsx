import React, { Props, ReactElement, useMemo } from 'react';
import { uuid } from 'uuidv4';

import ListItem from './ListItem';

import { Container } from './styles';

interface ItemProps<T> {
  item: T;
  key: string;
}

interface ListProps<T> extends Props<void> {
  items?: T[];
  keyExtractor?(item: T): string;
  renderItem?(props: ItemProps<T>): ReactElement;
}

function List<T>({
  items = [],
  keyExtractor = uuid,
  renderItem: RenderItem,
}: ListProps<T>) {
  const itemsWithKey = useMemo<ItemProps<T>[]>(
    () => items.map(item => ({ item, key: keyExtractor(item) })),
    [items, keyExtractor],
  );

  return (
    <Container>
      {itemsWithKey.map(({ item, key }) => (
        <ListItem key={key}>
          {RenderItem ? RenderItem({ item, key }) : <>{item}</>}
        </ListItem>
      ))}
    </Container>
  );
}

export default List;
