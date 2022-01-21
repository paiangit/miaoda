import { useParams, useNavigate } from 'react-router-dom';
import {
  useEffect,
  useState,
} from 'react';
import {
  Form,
} from 'antd';
import './ProfilePage.less';
import api from './api.ts';

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
  const genderMap = [
    '保密',
    '男',
    '女',
  ];

  useEffect(() => {
    api
      .getUser(params.userId)
      .then(res => {
        console.log(res);
        if (res.code === 0 && res.data) {
          setUserProfile(res.data);
        }
      })
      .catch(err => {
        console.log(err.message);
        setTimeout(() => {
          navigate('/authority/signIn');
        }, 3000);
      });
  }, []);

  return (
    <div className="user-profile-page">
      <h2 className="title">User Profile</h2>
      <Form>
        <Form.Item label="username">
          <div>{userProfile.username}</div>
        </Form.Item>
        <Form.Item label="id">
          <div>{userProfile.id}</div>
        </Form.Item>
        <Form.Item label="email">
          <div>{userProfile.email}</div>
        </Form.Item>
        <Form.Item label="gender">
          <div>{genderMap[userProfile.gender]}</div>
        </Form.Item>
      </Form>
    </div>
  );
}
