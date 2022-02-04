import { CheckLogin } from '../common/index';
import './MainPage.less';

function MainPage() {
  return (
    <div className="home-main-page">秒搭，助您轻松搭建企业级前端应用。</div>
  );
}

export default function () {
  const WrappedMainPage = CheckLogin(MainPage);

  return <WrappedMainPage />;
}
