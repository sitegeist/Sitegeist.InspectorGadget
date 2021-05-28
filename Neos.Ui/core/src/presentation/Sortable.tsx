import * as React from 'react';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';

const Item = SortableElement(({children}: {children: React.ReactElement}) => children);

const List = SortableContainer(({
    items,
    renderItem
}: {
    items: any[]
    renderItem: (item: any, index: number) => React.ReactElement
}) => {
  return (
    <div>
      {items.map(renderItem)}
    </div>
  );
});

export const Sortable = {Item, List};