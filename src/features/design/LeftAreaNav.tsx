import { useState } from 'react';
import { Tooltip } from 'antd';
import { BarsOutlined, AppstoreOutlined } from '@ant-design/icons';
import styles from './LeftAreaNav.module.less';

export default function LeftAreaNav() {
  const [activeIndex, setActiveIndex] = useState(0);
  const data = [
    {
      title: 'Component library',
      icon: <AppstoreOutlined />,
    },
    {
      title: 'Outline tree',
      icon: <BarsOutlined />,
    },
  ];

  function clickHandler(index: number) {
    return () => {
      setActiveIndex(index);
    };
  }

  function generateList(data) {
    return data.map((item, index) => (
      <li
        className={activeIndex === index ? `${styles['nav-item']} ${styles['active']}` : styles['nav-item']}
        onClick={clickHandler(index)}
        key={index}
        >
        <Tooltip title={item.title} placement="right">
          <button className={ styles['btn'] }>
            {item.icon}
          </button>
        </Tooltip>
      </li>
    ));
  }

  return (
    <ul className={ styles['design-left-area-nav'] }>
      { generateList(data) }
    </ul>
  );
}
