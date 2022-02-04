import { CheckLogin } from '../common/index';
import './MainPage.less';

function MainPage() {
  return <div className="home-main-page">home</div>;
}

export default function () {
  const WrappedMainPage = CheckLogin(MainPage);

  return <WrappedMainPage />;
}
