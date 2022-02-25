import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Form } from 'antd';
import useDocumentTitle from '~hooks/useDocumentTitle';
import { Loading } from '~components/Loading';
import useGetUser from './hooks/useGetUser';
import { useGetUserQueryKey } from './keys';
import style from './ProfilePage.module.less';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({
    username: '',
    id: null,
    gender: 0,
    // avatar: '',
    email: '',
  });
  const genderMap = ['保密', '男', '女'];

  useDocumentTitle('我的档案', false);

  const userQuery = useGetUser(useGetUserQueryKey(),  {
    keepPreviousData: true,
  });
  const { isLoading, isError, data } = userQuery;

  useEffect(() => {
    data && setUserProfile(data);
  }, [data]);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
  };

  const generateForm = () => {
    if (isLoading) {
      return (<Loading></Loading>);
    }

    return (
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
    );
  }


  if (isError) {
    setTimeout(() => {
      navigate('/auth/login');
    }, 3000);
    return (
      <div></div>
    );
  }

  return (
    <div className={ style['user-profile-page'] }>
      <h2 className={ style['title'] }>我的档案</h2>
      { generateForm() }
    </div>
  );
}
