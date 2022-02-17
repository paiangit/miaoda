import { Button, Form, Input, List, Typography } from 'antd';
import { useAddTodo, useRemoveTodo } from './redux/hooks';
import './TodoList.less';

export default function TodoList() {
  const { todoList, addTodo } = useAddTodo();
  const { removeTodo } = useRemoveTodo();
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    console.log(values.todo, todoList);
    addTodo(values.todo);
    // 清空输入框
    form.setFieldsValue({todo: ''});
  };

  const handleRemove = (index) => {
    return () => removeTodo(index);
  };

  const handleChange = (e) => {

  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
  };

  const tailLayout = { ...layout.wrapperCol, offset: 8 };

  return (
    <div className="examples-todo-list">
      <Form form={form} {...layout} onFinish={handleFinish}>
        <Form.Item
          label="待办"
          name="todo"
          rules={[
            {
              required: true,
              message: '请输入用户名',
            },
          ]}
        >
          <Input onChange={handleChange}/>
        </Form.Item>

        <Form.Item wrapperCol={tailLayout}>
          <Button type="primary" htmlType="submit">
            添加
          </Button>
        </Form.Item>
      </Form>

      <List
        className="list"
        header={<div>待办列表</div>}
        bordered
        dataSource={todoList}
        renderItem={
          (item, index) => (
            <List.Item key={index}>
              <Typography.Text>
                {item}
              </Typography.Text>
              <Button onClick={handleRemove(index)}>删除</Button>
            </List.Item>
          )
        }
      >
      </List>
    </div>
  );
}