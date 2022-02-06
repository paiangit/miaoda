import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Radio, Button, message } from 'antd';
import apis from './apis';
import { useMount, useDocumentTitle } from '../../common/hooks';
import './AppSettingsPage.less';

export default function AppSettingsPage() {
  useDocumentTitle('设置应用');

  const params = useParams();
  const [initialInfo, setInitialInfo] = useState({});
  const [form] = Form.useForm();

  useMount(() => {
    apis
      .getApp(params.appId)
      .then((res) => {
        console.log(res.data);
        setInitialInfo(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  });

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
    api
      .updateApp(params.appId, values)
      .then((res) => {
        if (res.code === 0) {
          message.success('保存成功！');
        }
      })
      .catch((err) => {
        message.error(`保存失败：${err.message}！`);
      });
  };

  const handleReset = () => {
    form.setFieldsValue(initialInfo);
  };

  useEffect(() => {
    // 必须把这个副作用放在useEffect内，否则会报错：Cannot update a component (`FormItem`) while rendering a different component
    // 见：https://stackoverflow.com/questions/62336340/cannot-update-a-component-while-rendering-a-different-component-warning
    form.setFieldsValue(initialInfo);
  }, [initialInfo]);

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
