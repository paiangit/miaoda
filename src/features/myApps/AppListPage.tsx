import { useState } from 'react';
import AppList from './AppList';
import SearchPanel from './SearchPanel';
import CreateAppModal from './CreateAppModal';
import { useDocumentTitle } from '../../common/hooks';
import './AppListPage.less';

export default function AppListPage() {
  useDocumentTitle('应用列表', false);

  const [keyword, setKeyword] = useState('');

  return (
    <>
      <div className="my-apps-app-list-page">
        <CreateAppModal />
        <SearchPanel keyword={keyword} setKeyword={setKeyword} />
        <AppList keyword={keyword} />
      </div>
    </>
  );
}
