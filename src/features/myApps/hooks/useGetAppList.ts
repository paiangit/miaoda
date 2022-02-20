import { useQuery } from 'react-query';
import request from '../../../utils/request';
import { App } from '../../../types';
import { GetAppListQueryKey } from '../keys';

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
export default function useGetAppList (getAppListQueryKey: GetAppListQueryKey, options?) {
  const [, params] = getAppListQueryKey;

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
