import React, { useCallback, useState } from 'react';
import useDocumentTitle from '~hooks/useDocumentTitle';
import TodoList from './TodoList';
import './TodosPage.less';

export default function TodosPage() {
  useDocumentTitle('例子：Todo List');
  const [, setValue] = useState('');

  const handleChange = useCallback((e) => {
    setValue(e.target.value);
  }, [setValue]);

  return (
    <div className="examples-todos-page">
      <input onChange={handleChange}></input>
      <TodoList></TodoList>
    </div>
  );
}
