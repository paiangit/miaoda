import { useParams } from 'react-router-dom';
import { Button } from 'antd';
import LeftArea from './LeftArea';
import CenterArea from './CenterArea';
import RightArea from './RightArea';
import { useDocumentTitle } from '../../common/hooks';
import './DesignerPage.less';

export default function DesignerPage() {
  useDocumentTitle('编辑应用');

  // 下面两个hook分别将Url中的appId和pageId转成number类型
  // url的格式为：http://localhost/app/${appId}/design/${pageId}
  const useDesignerParams = () => {
    const params = useParams();
    return {
      ...params,
      appId: Number(params.appId) || undefined,
      pageId: Number(params.pageId) || undefined,
    };
  };

  const params = useDesignerParams();

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
