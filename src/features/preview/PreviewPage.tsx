import {
  useParams,
  useSearchParams,
} from 'react-router-dom';
import './PreviewPage.less';

export default function PreviewPage() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const pageId = searchParams.get('pageId');

  return (
    <div className="preview-preview-page">
      Preview app {params.appId} page {pageId}
    </div>
  );
}
