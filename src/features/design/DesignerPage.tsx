import {
  useParams,
  useSearchParams,
} from 'react-router-dom';
import './DesignerPage.less';

export default function DesignerPage() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const pageId = searchParams.get('pageId');

  return (
    <div className="design-designer-page">
      Design app {params.appId} page {pageId}
    </div>
  );
}
