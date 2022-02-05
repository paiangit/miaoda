import { useParams, useSearchParams } from 'react-router-dom';
import { useDocumentTitle } from '../common/hooks/useDocumentTitle';
import './PreviewPage.less';

export default function PreviewPage() {
  useDocumentTitle('预览应用');

  const params = useParams();
  const [searchParams] = useSearchParams();
  const pageId = searchParams.get('pageId');

  return (
    <div className="preview-preview-page">
      Preview app {params.appId} page {pageId}
    </div>
  );
}
