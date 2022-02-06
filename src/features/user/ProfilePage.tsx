import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Form } from 'antd';
import apis from './apis';
import { useDocumentTitle } from '../../common/hooks';
import './ProfilePage.less';

export default function ProfilePage() {
  const params = useParams();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({
    username: '',
    id: '',
    gender: 0,
    // avatar: '',
    email: '',
  });
  const genderMap = ['保密', '男', '女'];

  useDocumentTitle('我的档案', false);

  useEffect(() => {
    apis
      .getUser(params.userId)
      .then((res) => {
        console.log(res);
        if (res.code === 0 && res.data) {
          setUserProfile(res.data);
        }
      })
      .catch((err) => {
        console.log(err.message);
        setTimeout(() => {
          navigate('/auth/login');
        }, 3000);
      });
  }, []);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
  };

  return (
    <div className="user-profile-page">
      <h2 className="title">我的档案</h2>
      <Form {...layout}>
        <Form.Item label="用户名">
          <div>{userProfile.username}</div>
        </Form.Item>
        <Form.Item label="用户编号">
          <div>{userProfile.id}</div>
        </Form.Item>
        <Form.Item label="Email">
          <div>{userProfile.email}</div>
        </Form.Item>
        <Form.Item label="性别">
          <div>{genderMap[userProfile.gender]}</div>
        </Form.Item>
      </Form>
    </div>
  );
}
