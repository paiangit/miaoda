import { useParams } from 'react-router-dom';
import { useDocumentTitle, useUrlQueryParams } from '../../common/hooks';
import './PreviewPage.less';

export default function PreviewPage() {
  useDocumentTitle('预览应用');

  // 下面两个hook分别将Url中的appId和pageId转成number类型
  // url的格式为：http://localhost/app/${appId}/preview?pageId=${pageId}
  const usePreviewParams = () => {
    const params = useParams();
    return { ...params, appId: Number(params.appId) || undefined };
  };
  const usePreviewSearchParams = () => {
    const [params] = useUrlQueryParams(['pageId']);
    return { ...params, pageId: Number(params.pageId) || undefined };
  };

  const params = usePreviewParams();
  const searchParams = usePreviewSearchParams();
  console.log(
    params.appId,
    typeof params.appId,
    searchParams.pageId,
    typeof searchParams.pageId
  );

  return (
    <div className="preview-preview-page">
      Preview app {params.appId} page {searchParams.pageId}
    </div>
  );
}
