import CheckLogin from '~hocs/CheckLogin';
import useDocumentTitle from '~hooks/useDocumentTitle';
import style from './MainPage.module.less';

function MainPageRaw() {
  return (
    <div className={ style['home-main-page'] }>秒搭，助您轻松搭建企业级前端应用。</div>
  );
}

export default function MainPage () {
  useDocumentTitle('首页');

  const WrappedMainPage = CheckLogin(MainPageRaw);

  return <WrappedMainPage />;
}
