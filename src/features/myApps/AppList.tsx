import { useCallback, useEffect, useState } from 'react';
import { Empty, Tag, Tooltip, Spin, Pagination } from 'antd';
import { ChromeOutlined } from '@ant-design/icons';
import { useUrlQueryParams, useMount } from '../../common/hooks';
import AppOperationDropdown from './AppOperationDropdown';
import { useGetAppList } from './hooks';
import { useGetAppListQueryKey } from './keys';
import { defaultCurrentPage, defaultPageSize } from './const';
import './AppList.less';

interface AppListProps {
  keyword: string;
  setRefetch: (fetch) => void;
}

export default function AppList({ keyword, setRefetch }: AppListProps) {
  const [urlQueryParams, setUrlQueryParams] = useUrlQueryParams([
    'keyword',
    'page',
    'pageSize',
  ]);

  useMount(() => {
    setUrlQueryParams({
      ...urlQueryParams,
      page: defaultCurrentPage,
      pageSize: defaultPageSize,
    });
  });

  const getAppListQueryKey = useGetAppListQueryKey();
  const appListQuery = useGetAppList(getAppListQueryKey, {
    keepPreviousData: true,
  });
  const { isLoading, isError, data: appList, refetch } = appListQuery;

  const handlePageChange = useCallback(
    (pageNumber) => {
      setUrlQueryParams({
        ...urlQueryParams,
        page: pageNumber,
      });
    },
    [setUrlQueryParams, urlQueryParams]
  );

  const handlePageSizeChange = useCallback(
    (pageSize) => {
      setUrlQueryParams({
        ...urlQueryParams,
        pageSize,
      });
    },
    [setUrlQueryParams, urlQueryParams]
  );

  setRefetch(refetch);

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

    if (!appList || !appList.data.length) {
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
        refetch();
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
