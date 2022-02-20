import { useRef } from 'react';
import AppList from './AppList';
import SearchPanel from './SearchPanel';
import CreateAppModal from './CreateAppModal';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useUrlQueryParams from '../../hooks/useUrlQueryParams';
import './AppListPage.less';

export default function AppListPage() {
  useDocumentTitle('应用列表', false);

  const [params, setParams] = useUrlQueryParams(['keyword']);
  const refetchRef = useRef(null);
  const setRefetchRef = (newRefetch) => {
    refetchRef.current = newRefetch;
  };

  const handleCreateSuccess = () => {
    refetchRef.current && refetchRef.current();
  };

  return (
    <>
      <div className="my-apps-app-list-page">
        <CreateAppModal onSuccess={handleCreateSuccess} />
        <SearchPanel keyword={params.keyword as string} setParams={setParams} />
        <AppList keyword={params.keyword as string} setRefetch={setRefetchRef} />
      </div>
    </>
  );
}
