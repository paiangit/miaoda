import styles from './FullPage.module.less';

export const FullPage = (props) => {
  return <div className={ styles['common-full-page'] }>{props.children}</div>;
};
