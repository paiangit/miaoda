import { useQuery } from 'react-query';
import { request } from '../../../common/utils';
import { App } from '../../../common/types';
import { GetAppQueryKey } from '../keys';

export const getApp = async (id: number) => {
  const result = await request({
    method: 'get',
    url: `/app/${id}`,
  });

  return result.data as App | undefined;
};

export function useGetApp(getAppQueryKey: GetAppQueryKey) {
  const [, id] = getAppQueryKey;

  return useQuery(
    getAppQueryKey,
    async () => {
      return await getApp(id);
    },
    {
      enabled: !!id, // 表示当id为空的时候，就不要发起请求了
    }
  );
}
