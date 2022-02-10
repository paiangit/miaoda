import { useQuery } from 'react-query';
import { request } from '../../../common/utils';
import { App } from '../../../common/types';
import { GetAppListQueryKey } from '../keys';
import { defaultCurrentPage, defaultPageSize } from '../const';

// 类型声明
export interface GetAppListResult {
  data: App[];
  offset: number;
  pageSize: number;
  totalCount: number;
}

// 接口封装层
export const getAppList = async (params) => {
  const res = await request({
    method: 'get',
    url: '/app/list',
    params,
  });

  return res.data as GetAppListResult | undefined;
};

// hook封装层
export const useGetAppList = (
  getAppListQueryKey: GetAppListQueryKey,
  options?
) => {
  const [key, params] = getAppListQueryKey;

  // if (params.offset == null) {
  //   params.offset = defaultCurrentPage * defaultPageSize;
  // }
  // if (!params.pageSize) {
  //   params.pageSize = defaultPageSize;
  // }
  debugger;

  return useQuery(
    getAppListQueryKey,
    async () => {
      return await getAppList(params);
    },
    {
      ...options,
      enabled: params.pageSize > 0 && params.offset >= 0,
    }
  );
};
