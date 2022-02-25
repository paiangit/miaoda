// import React, { useState } from 'react';
import LeftAreaNav from './LeftAreaNav';
import style from './LeftArea.module.less';

export default function LeftArea() {
  return (
    <div className={ style['design-left-area'] }>
      <LeftAreaNav></LeftAreaNav>
    </div>
  );
}
