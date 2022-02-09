import { useState, useRef } from 'react';
import AppList from './AppList';
import SearchPanel from './SearchPanel';
import CreateAppModal from './CreateAppModal';
import { useDocumentTitle } from '../../common/hooks';
import './AppListPage.less';

export default function AppListPage() {
  useDocumentTitle('应用列表', false);

  const [keyword, setKeyword] = useState('');
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
        <SearchPanel keyword={keyword} setKeyword={setKeyword} />
        <AppList keyword={keyword} setRefetch={setRefetchRef} />
      </div>
    </>
  );
}
