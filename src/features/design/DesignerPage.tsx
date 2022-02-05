import { useParams } from 'react-router-dom';
import { Button } from 'antd';
import LeftArea from './LeftArea';
import CenterArea from './CenterArea';
import RightArea from './RightArea';
import { useDocumentTitle, useUrlQueryParams } from '../../common/hooks';
import './DesignerPage.less';

export default function DesignerPage() {
  useDocumentTitle('编辑应用');

  const params = useParams();
  const [{ pageId }] = useUrlQueryParams(['pageId']);
  console.log(params.appId, pageId);

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
