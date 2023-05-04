// components/GridItem.tsx
import React from 'react';

interface GridItemProps {
  id: string;
  children: React.ReactNode;
}

const GridItem: React.FC<GridItemProps> = ({ id, children }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const draggedItemId = e.dataTransfer.getData('text/plain');
    const draggedItem = document.getElementById(draggedItemId);

    if (draggedItem) {
      e.currentTarget.parentElement?.insertBefore(draggedItem, e.currentTarget);
    }
  };

  return (
    <div
      id={id}
      className="grid-item"
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}
    </div>
  );
};

export default GridItem;
