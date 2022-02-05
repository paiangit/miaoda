import { CheckLogin } from '../../common/hocs';
import { useDocumentTitle } from '../../common/hooks';
import './MainPage.less';

function MainPage() {
  return (
    <div className="home-main-page">秒搭，助您轻松搭建企业级前端应用。</div>
  );
}

export default function () {
  useDocumentTitle('首页');

  const WrappedMainPage = CheckLogin(MainPage);

  return <WrappedMainPage />;
}
