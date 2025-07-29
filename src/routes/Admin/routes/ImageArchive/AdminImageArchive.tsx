import React from 'react';
import { ImageArchive } from '../../components/ImageArchive';
import { Panel } from '../../components/Panel';

export const AdminImageArchive = () => {
  return (
    <div>
      <Panel.Title text="Архив изображений" />
      <ImageArchive />
    </div>
  );
};
