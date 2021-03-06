import useDocumentTitle from '~hooks/useDocumentTitle';
import TodoList from './TodoList';
import styles from './TodosPage.module.less';

export default function TodosPage() {
  useDocumentTitle('例子：Todo List');

  return (
    <div className={ styles['examples-todos-page'] }>
      <TodoList></TodoList>
    </div>
  );
}
