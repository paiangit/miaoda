import { useState } from 'react';
import AppList from './AppList.tsx';
import SearchPanel from './SearchPanel.tsx';
import CreateAppModal from './CreateAppModal.tsx';
import './AppListPage.less';

export default function AppListPage() {
  const [keyword, setKeyword] = useState('');

  return (
    <div className="my-apps-app-list-page">
      <CreateAppModal />
      <SearchPanel keyword={keyword} setKeyword={setKeyword} />
      <AppList keyword={keyword} />
    </div>
  );
}
