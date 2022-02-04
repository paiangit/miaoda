import { useSearchParams } from 'react-router-dom';
import { Button } from 'antd';
import LeftArea from './LeftArea';
import CenterArea from './CenterArea';
import RightArea from './RightArea';
import './DesignerPage.less';

export default function DesignerPage() {
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
