import { useQuery } from 'react-query';
import { request } from '../../../common/utils';
import { App } from '../../../common/types';
import { prefix } from './prefix';

// 类型声明
export interface GetAppListParams {
  title: string;
  pageSize: number;
  offset: number;
}

export interface GetAppListResult {
  data: App[];
  offset: number;
  pageSize: number;
  totalCount: number;
}

// 接口封装层
export const getAppList = async (params: GetAppListParams) => {
  const res = await request({
    method: 'get',
    url: '/app/list',
    params,
  });

  return res.data as GetAppListResult | undefined;
};

// hook封装层
export const useGetAppList = (params: GetAppListParams, options) => {
  return useQuery([prefix('getAppList'), params, options], async () => {
    return await getAppList(params);
  });
};
