import { CheckLogin } from '../../common/hocs';
import { useDocumentTitle } from '../../common/hooks';
import './MainPage.less';

function MainPageRaw() {
  return (
    <div className="home-main-page">秒搭，助您轻松搭建企业级前端应用。</div>
  );
}

export default function MainPage () {
  useDocumentTitle('首页');

  const WrappedMainPage = CheckLogin(MainPageRaw);

  return <WrappedMainPage />;
}
