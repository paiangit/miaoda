import React from 'react';
import { Button, Form, Input, List, Typography } from 'antd';
import { useCallback, useMemo} from 'react';
import { useAddTodo, useRemoveTodo, useAddTodoAsync } from './redux/slice';
import styles from './TodoList.module.less';

function TodoList() {
  const { todoList, addTodo } = useAddTodo();
  const { addTodoAsync } = useAddTodoAsync();
  const { removeTodo } = useRemoveTodo();
  const [form] = Form.useForm();

  const handleFinish = useCallback((values) => {
    addTodo(values.todo);
    // 清空输入框
    form.setFieldsValue({todo: ''});
  }, [addTodo, form]);

  const validateAndSubmit = useCallback((e) => {
    const todo = form.getFieldValue('todo');
    addTodoAsync(todo);
    // 清空输入框
    form.setFieldsValue({todo: ''});
  }, [addTodoAsync, form]);

  const handleRemove = useCallback((index) => {
    return () => removeTodo(index);
  }, [removeTodo]);

  const layout = useMemo(() => {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 8 },
    };
  }, []);

  const tailLayout = useMemo(() => {
    return {
      ...layout.wrapperCol,
      offset: 8,
    }
  }, [layout]);

  const todoRule = useMemo(() => [
    {
      required: true,
      message: '请输入用户名',
    },
  ], [])

  const renderItem = useCallback((item, index) => (
    <List.Item key={index}>
      <Typography.Text>
        {item}
      </Typography.Text>
      <Button onClick={handleRemove(index)}>删除</Button>
    </List.Item>
  ), [handleRemove]);

  return (
    <div className={ styles['examples-todo-list'] }>
      <Form form={form} labelCol={layout.labelCol} wrapperCol={layout.wrapperCol} onFinish={handleFinish}>
        <Form.Item
          label="待办"
          name="todo"
          rules={todoRule}
        >
          <Input/>
        </Form.Item>

        <Form.Item wrapperCol={tailLayout}>
          <Button type="primary" htmlType="submit">
            添加
          </Button>
          <Button className={ styles['validate-and-submit'] } type="primary" onClick={validateAndSubmit}>
            先校验再添加
          </Button>
        </Form.Item>
      </Form>

      <List
        className={ styles['list'] }
        header={<div>待办列表</div>}
        bordered
        dataSource={todoList}
        renderItem={
          renderItem
        }
      >
      </List>
    </div>
  );
}

export default React.memo(TodoList, () => true);
