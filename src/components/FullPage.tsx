import style from './FullPage.module.less';

export const FullPage = (props) => {
  return <div className={ style['common-full-page'] }>{props.children}</div>;
};
