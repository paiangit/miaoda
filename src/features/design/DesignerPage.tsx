import {
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { Button } from 'antd';
import { DesktopOutlined, MobileOutlined } from '@ant-design/icons';
import LeftArea from './LeftArea.tsx';
import CenterArea from './CenterArea.tsx';
import RightArea from './RightArea.tsx';
import './DesignerPage.less';

export default function DesignerPage() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const pageId = searchParams.get('pageId');

  return (
    <div className="design-designer-page">
      <div className="designer-header">
        <Button>预览</Button>
        <Button type="primary">保存</Button>
      </div>
      <div className="designer-body">
        <LeftArea></LeftArea>
        <CenterArea></CenterArea>
        <RightArea></RightArea>
      </div>
    </div>
  );
}