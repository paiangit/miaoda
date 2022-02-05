import { useParams } from 'react-router-dom';
import { useDocumentTitle, useUrlQueryParams } from '../../common/hooks';
import './PreviewPage.less';

export default function PreviewPage() {
  useDocumentTitle('预览应用');

  const params = useParams();
  const [{ pageId }] = useUrlQueryParams(['pageId']);

  return (
    <div className="preview-preview-page">
      Preview app {params.appId} page {pageId}
    </div>
  );
}
