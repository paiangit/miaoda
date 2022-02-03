import { message, Empty, Tag, Tooltip, Menu, Dropdown } from 'antd';
import {
  ChromeOutlined,
  EllipsisOutlined,
  SettingOutlined,
  EyeOutlined,
  CopyOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api.ts';
import './AppList.less';

interface AppListProps {
  keyword: string;
}

export default function AppList(props: AppListProps) {
  const { keyword } = props;
  const [list, setList] = useState([]);

  useEffect(() => {
    getData({
      title: keyword,
      pageSize: 30,
      offset: 0,
    });
  }, [keyword]);

  const getData = (params) => {
    api
      .getAppList(params)
      .then((res) => {
        if (res.code === 0) {
          setList(res.data.data);
        }
      })
      .catch((err) => {
        message.error(`获取应用列表失败：${err.message}`);
      });
  };

  const navigate = useNavigate();
  const handleMenuClick = (e) => {
    const { key } = e;
    const id = e.domEvent.currentTarget.parentElement.getAttribute('data-id');

    switch (key) {
      case '1':
        // 应用设置
        navigate(`/app/${id}/admin/appSettings`);
        break;
      case '2':
        // 访问应用 TODO: 替换pageId
        navigate(`/app/${id}/preview?pageId=123`);
        break;
      case '3':
        // TODO: 复制应用
        break;
      case '4':
        // 删除应用
        api
          .deleteApp(id)
          .then((res) => {
            if (res.code === 0) {
              message.success('删除成功！');
            }
          })
          .catch((err) => {
            message.success(`删除失败！${err.message}`);
          });
        break;
      default:
        break;
    }
  };

  const handleEllipsisClick = (evt) => {
    evt.preventDefault();
  };

  const getMenu = (id) => (
    <Menu onClick={handleMenuClick} data-id={id}>
      <Menu.Item key="1" icon={<SettingOutlined />}>
        应用设置
      </Menu.Item>
      <Menu.Item key="2" icon={<EyeOutlined />}>
        访问应用
      </Menu.Item>
      <Menu.Item key="3" icon={<CopyOutlined />}>
        复制应用
      </Menu.Item>
      <Menu.Item
        key="4"
        icon={<DeleteOutlined />}
        style={{ color: 'rgb(255, 82, 25)' }}
      >
        删除应用
      </Menu.Item>
    </Menu>
  );

  const apps = list.map((item) => {
    const tagMap = {
      '0': <Tag className="deleted">已删除</Tag>,
      '1': <Tag className="offline">未启用</Tag>,
      '2': <Tag className="online">已启用</Tag>,
    };
    const tag = tagMap[item.status];

    return (
      <a className="app-card" key={item.id} href={`/app/${item.id}/admin/123`}>
        <div className="header">
          <div className="icon">
            <ChromeOutlined />
          </div>
          <div className="title">{item.title}</div>
        </div>
        <p className="description">
          <Tooltip
            title={item.description}
            placement="bottom"
            mouseEnterDelay={0.3}
          >
            {item.description}
          </Tooltip>
        </p>

        <div className="footer">
          {tag}
          <Dropdown overlay={getMenu(item.id)} placement="bottomCenter">
            <EllipsisOutlined onClick={handleEllipsisClick} />
          </Dropdown>
        </div>
      </a>
    );
  });

  return (
    <div className="my-apps-app-list">
      {apps.length ? apps : <Empty description="没有满足条件的应用"></Empty>}
    </div>
  );
}
