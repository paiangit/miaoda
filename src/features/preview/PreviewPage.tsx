import { useParams } from 'react-router-dom';
import useDocumentTitle from '~hooks/useDocumentTitle';
import styles from './PreviewPage.module.less';

export default function PreviewPage() {
  useDocumentTitle('预览应用');

  // 下面两个hook分别将Url中的appId和pageId转成number类型
  // url的格式为：http://localhost/app/${appId}/preview/${pageId}
  const usePreviewParams = () => {
    const params = useParams();
    return {
      ...params,
      appId: Number(params.appId) || undefined,
      pageId: Number(params.pageId) || undefined,
    };
  };

  const params = usePreviewParams();

  return (
    <div className={ styles['preview-preview-page'] }>
      Preview app {params.appId} page {params.pageId}
    </div>
  );
}
