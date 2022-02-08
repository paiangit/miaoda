import { Dropdown, Menu, Button } from 'antd';
import {
  EllipsisOutlined,
  SettingOutlined,
  EyeOutlined,
  CopyOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDeleteApp } from './hooks';
import './AppOperationDropdown.less';

interface AppOperationDropDownProps {
  id: number;
  onDeleteSuccess: () => void;
}

const handleEllipsisClick = (
  evt: React.MouseEvent<HTMLElement, MouseEvent>
) => {
  evt.preventDefault();
};

export default function AppOperationDropDown({
  id,
  onDeleteSuccess,
}: AppOperationDropDownProps) {
  const deleteAppMutation = useDeleteApp();
  const { mutate: deleteApp } = deleteAppMutation;
  const navigate = useNavigate();
  const handleMenuClick = (e) => {
    const { key } = e;

    switch (+key) {
      case 1:
        // 应用设置
        navigate(`/app/${id}/admin/appSettings`);
        break;
      case 2:
        // 访问应用 TODO: 替换pageId
        navigate(`/app/${id}/preview?pageId=123`);
        break;
      case 3:
        // TODO: 复制应用
        break;
      case 4:
        // 删除应用
        deleteApp({
          id,
          onSuccess: onDeleteSuccess,
        });
        break;
      default:
        break;
    }
  };

  return (
    <Dropdown
      // 下面的overlay的内容不可以提取到单独的组件中，否则会导致Menu的部分样式丢失，如box-shadow、item的hover态等，这个问题比较奇怪
      overlay={
        <Menu
          className="my-apps-app-operation-dropdown"
          onClick={handleMenuClick}
        >
          <Menu.Item key={1}>
            <Button type="link" icon={<SettingOutlined />}>
              应用设置
            </Button>
          </Menu.Item>
          <Menu.Item key={2}>
            <Button type="link" icon={<EyeOutlined />}>
              访问应用
            </Button>
          </Menu.Item>
          {/* <Menu.Item key={3}>
          <Button type="link" icon={<CopyOutlined />}>复制应用</Button>
        </Menu.Item> */}
          <Menu.Item key={4}>
            <Button
              type="link"
              icon={<DeleteOutlined />}
              style={{ color: 'rgb(255, 82, 25)' }}
              loading={deleteAppMutation.isLoading}
            >
              删除应用
            </Button>
          </Menu.Item>
        </Menu>
      }
      placement="bottomCenter"
    >
      <EllipsisOutlined onClick={handleEllipsisClick} />
    </Dropdown>
  );
}
