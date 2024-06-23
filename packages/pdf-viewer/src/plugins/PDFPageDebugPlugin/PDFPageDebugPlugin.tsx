/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import { usePageCoverRenderer } from '../../context';

const PDFPageDebugPlugin = () => {
  const renderPageCover = usePageCoverRenderer();

  return (
    <>
      {renderPageCover((pageIndex, { viewport, zoom }) => (
        <div>{pageIndex}</div>
      ))}
    </>
  );
};

export default PDFPageDebugPlugin;
