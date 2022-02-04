import { useState } from 'react';
import AppList from './AppList';
import SearchPanel from './SearchPanel';
import CreateAppModal from './CreateAppModal';
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
