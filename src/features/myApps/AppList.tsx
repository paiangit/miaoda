import { useCallback, useEffect } from 'react';
import { Empty, Tag, Tooltip, Pagination } from 'antd';
import { ChromeOutlined } from '@ant-design/icons';
import useUrlQueryParams from '../../hooks/useUrlQueryParams';
import { Loading } from '../../components/Loading';
import { Retry } from '../../components/Retry';
import AppOperationDropdown from './AppOperationDropdown';
import useGetAppList from './hooks/useGetAppList';
import { useGetAppListQueryKey } from './keys';
import { defaultCurrentPage, defaultPageSize } from './const';
import './AppList.less';

interface AppListProps {
  keyword: string;
  setRefetch: (fetch) => void;
}

export default function AppList({ keyword, setRefetch }: AppListProps) {
  const [,setUrlQueryParams] = useUrlQueryParams([
    'keyword',
    'page',
    'pageSize',
  ]);

  useEffect(() => {
    setUrlQueryParams({
      page: defaultCurrentPage,
      pageSize: defaultPageSize,
      keyword,
    });
  }, [keyword]); // 注意这里不能把 setUrlQueryParams 加进来，否则会造成循环渲染

  const appListQuery = useGetAppList(useGetAppListQueryKey(), {
    keepPreviousData: true,
  });
  const { isLoading, isError, data: appList, refetch } = appListQuery;

  const handlePageChange = useCallback(
    (pageNumber, pageSize) => {
      setUrlQueryParams({
        page: Math.max(pageNumber, 1),
        pageSize,
      });
    },
    [setUrlQueryParams]
  );

  setRefetch(refetch);

  const generateApps = () => {
    if (isLoading) {
      return (<Loading></Loading>);
    }

    if (isError) {
      return (<Retry></Retry>);
    }

    if (!appList || !appList.data.length) {
      return <Empty description="没有满足条件的应用"></Empty>;
    }

    const listContent = appList.data.map((item) => {
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

    return (
      <div className="list">{listContent}</div>
    );
  };

  const genPagination = () => {
    if (isLoading || isError) {
      return (<div></div>);
    }

    return (
      <Pagination
        showQuickJumper
        showSizeChanger
        defaultCurrent={defaultCurrentPage}
        defaultPageSize={defaultPageSize}
        total={appList?.totalCount || 0}
        onChange={handlePageChange}
      />
    );
  };

  return (
    <div className="my-apps-app-list">
      {generateApps()}
      <div className="pagination">{genPagination()}</div>
    </div>
  );
}

// AppList.whyDidYouRender = true;
