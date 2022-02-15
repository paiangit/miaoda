import { Button } from 'antd';
import { DesktopOutlined, MobileOutlined } from '@ant-design/icons';
import './CenterArea.less';

export default function CenterArea() {
  return (
    <div className="design-center-area">
      <div className="toolbar">
        <Button size="small" type="text"><DesktopOutlined /></Button>
        <Button size="small" type="text"><MobileOutlined /></Button>
      </div>
      <div className="simulator">
        <div className="simulator-content">
          <iframe title="设计器" className="simulator-canvas"></iframe>
        </div>
      </div>
    </div>
  )
}
