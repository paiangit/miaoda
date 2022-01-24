import { CheckLogin } from '../common/index.tsx';
import './MainPage.less';

function MainPage() {
  return (
    <div className="home-main-page">
      home
    </div>
  );
}

export default function() {
  const WrappedMainPage = CheckLogin(MainPage);

  return <WrappedMainPage/>;
}
