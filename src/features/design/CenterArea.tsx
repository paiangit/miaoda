import { Button } from 'antd';
import { DesktopOutlined, MobileOutlined } from '@ant-design/icons';
import styles from './CenterArea.module.less';

export default function CenterArea() {
  return (
    <div className={ styles['design-center-area'] }>
      <div className={ styles['toolbar'] }>
        <Button size="small" type="text"><DesktopOutlined /></Button>
        <Button size="small" type="text"><MobileOutlined /></Button>
      </div>
      <div className={ styles['simulator'] }>
        <div className={ styles['simulator-content'] }>
          <iframe title="设计器" className={ styles['simulator-canvas'] }></iframe>
        </div>
      </div>
    </div>
  )
}
