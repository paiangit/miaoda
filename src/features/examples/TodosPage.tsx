import { useDocumentTitle } from '../../common/hooks';
import TodoList from './TodoList';
import './TodosPage.less';

export default function TodosPage() {
  useDocumentTitle('例子：Todo List');

  return (
    <div className="examples-todos-page">
      <TodoList />
    </div>
  );
}