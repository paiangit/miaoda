import { useQuery } from 'react-query';
import { request } from '../../../common/utils';
import { App } from '../../../common/types';

export const getApp = async (id: number) => {
  const result = await request({
    method: 'get',
    url: `/app/${id}`,
  });

  return result.data as App | undefined;
};

export function useGetApp(id: number) {
  return useQuery(['getApp', id], async () => {
    return await getApp(id);
  });
}
