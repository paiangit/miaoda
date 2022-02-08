import { useState, useEffect } from 'react';
import { Empty, Tag, Tooltip, Spin, Pagination } from 'antd';
import { ChromeOutlined } from '@ant-design/icons';
import { useMount } from '../../common/hooks';
import AppOperationDropdown from './AppOperationDropdown';
import { useGetAppList } from './hooks';
import './AppList.less';

interface AppListProps {
  keyword: string;
  setQuery: React.Dispatch<any>;
}

export default function AppList({ keyword, setQuery }: AppListProps) {
  const defaultCurrentPage = 1;
  const defaultPageSize = 2;
  const [page, setPage] = useState(defaultCurrentPage);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const appListQuery = useGetAppList(
    {
      title: keyword,
      pageSize,
      offset: (page - 1) * pageSize,
    },
    {
      keepPreviousData: true,
    }
  );
  const { isLoading, isError, data: appList } = appListQuery;

  useMount(() => {
    setQuery(appListQuery);
  });

  const generateApps = () => {
    if (isLoading) {
      return (
        <div className="loading">
          <Spin></Spin>
        </div>
      );
    }

    if (isError) {
      return <div className="error-tip">服务器开小差了，请稍后重试~</div>;
    }

    if (!appList.data.length) {
      return <Empty description="没有满足条件的应用"></Empty>;
    }

    return appList.data.map((item) => {
      const tagMap = {
        '0': <Tag className="deleted">已删除</Tag>,
        '1': <Tag className="offline">未启用</Tag>,
        '2': <Tag className="online">已启用</Tag>,
      };
      const tag = tagMap[item.status];

      const handleDeleteSuccess = () => {
        appListQuery.refetch();
      };

      return (
        <a
          className="app-card"
          key={item.id}
          href={`/app/${item.id}/admin/123`}
        >
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
            <AppOperationDropdown
              id={item.id}
              onDeleteSuccess={handleDeleteSuccess}
            />
          </div>
        </a>
      );
    });
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handlePageSizeChange = (pageSize) => {
    setPageSize(pageSize);
  };

  const genPagination = () => {
    return (
      <Pagination
        showQuickJumper
        defaultCurrent={defaultCurrentPage}
        defaultPageSize={defaultPageSize}
        total={appList?.totalCount || 0}
        onChange={handlePageChange}
        onShowSizeChange={handlePageSizeChange}
      />
    );
  };

  return (
    <div className="my-apps-app-list">
      <div className="list">{generateApps()}</div>
      <div className="pagination">{genPagination()}</div>
    </div>
  );
}
