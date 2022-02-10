import { useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Radio, Button, Spin } from 'antd';
import { useDocumentTitle } from '../../common/hooks';
import { useGetApp, useUpdateApp } from './hooks';
import './AppSettingsPage.less';

export default function AppSettingsPage() {
  useDocumentTitle('设置应用');

  const params = useParams();
  const [form] = Form.useForm();
  const appId = Number(params.appId);
  const getAppQuery = useGetApp(appId);
  const { isLoading, isError, data: initialInfo } = getAppQuery;
  const updateAppMutation = useUpdateApp(appId);
  const { mutateAsync: updateApp } = updateAppMutation;

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
  };

  const tailLayout = {
    wrapperCol: {
      offset: 8,
      span: 8,
    },
  };

  const handleFinish = (values) => {
    updateApp(values);
  };

  const handleReset = useCallback(() => {
    form.setFieldsValue(initialInfo);
  }, [form, initialInfo]);

  useEffect(() => {
    // 必须把这个副作用放在useEffect内，否则会报错：Cannot update a component (`FormItem`) while rendering a different component
    // 见：https://stackoverflow.com/questions/62336340/cannot-update-a-component-while-rendering-a-different-component-warning
    // 另外，会报一个错误，Warning: Instance created by `useForm` is not connected to any Form element.
    // 所以需要用setTimeout包裹一下，原因待研究
    // https://stackoverflow.com/questions/61056421/warning-instance-created-by-useform-is-not-connect-to-any-form-element/65641605
    setTimeout(() => {
      form.setFieldsValue(initialInfo);
    }, 0);
  }, [initialInfo, form]);

  if (isLoading) {
    return <Spin></Spin>;
  }

  if (isError) {
    const handleClick = () => window.location.reload();

    return (
      <div>
        服务器开小差了，请稍侯重试~
        <Button type="primary" onClick={handleClick}></Button>
      </div>
    );
  }

  return (
    <div className="settings-app-settings">
      <Form form={form} {...layout} onFinish={handleFinish}>
        <Form.Item label="应用名称" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="应用图标" name="icon">
          <Input />
        </Form.Item>
        <Form.Item label="应用描述" name="description">
          <Input.TextArea maxLength={100} showCount rows={4} />
        </Form.Item>
        <Form.Item label="应用主题色" name="themeColor">
          <Radio.Group>
            <Radio value={0}>蓝色</Radio>
            <Radio value={1}>橙色</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
          <Button className="reset" htmlType="button" onClick={handleReset}>
            重置
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
