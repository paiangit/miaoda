// import React, { useState } from 'react';
import LeftAreaNav from './LeftAreaNav';
import styles from './LeftArea.module.less';

export default function LeftArea() {
  return (
    <div className={ styles['design-left-area'] }>
      <LeftAreaNav></LeftAreaNav>
    </div>
  );
}
