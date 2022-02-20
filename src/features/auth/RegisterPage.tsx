import { Form, Button, Input } from 'antd';
import useCreateUser from './hooks/useCreateUser';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import './RegisterPage.less';

export default function RegisterPage() {
  useDocumentTitle('用户注册');

  const [form] = Form.useForm();
  const { mutateAsync: createUser, isLoading } = useCreateUser();

  function handleFinish(values) {
    const { username, email, password, retypePassword } = values;

    if (retypePassword !== password) return;

    // 注册之前移除登录token
    window.localStorage.removeItem(process.env.REACT_APP_ACCESS_TOKEN_KEY);

    const user = {
      username,
      password,
      email,
    }

    createUser(user).then(res => {
      form.resetFields();
    });
  }

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
  };

  return (
    <div className="auth-register-page">
      <h2 className="title">用户注册</h2>
      <Form {...layout} form={form} onFinish={handleFinish}>
        <Form.Item
          label="用户名"
          name="username"
          rules={[
            {
              required: true,
              message: '请输入用户名',
            },
          ]}
        >
          <Input maxLength={14} />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[
            {
              required: true,
              message: '请输入密码',
            },
          ]}
        >
          <Input.Password maxLength={14} />
        </Form.Item>
        <Form.Item
          label="确认密码"
          name="retypePassword"
          rules={[
            {
              required: true,
              message: '请输入确认密码',
            },
          ]}
        >
          <Input.Password maxLength={14} />
        </Form.Item>
        <Form.Item
          label="E-mail"
          name="email"
          rules={[
            {
              required: true,
              message: '请输入你的E-mail',
            },
            {
              type: 'email',
              message: '不是合法的E-mail',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            注册
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
