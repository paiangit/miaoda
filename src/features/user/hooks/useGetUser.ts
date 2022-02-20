import { useQuery } from 'react-query';
import request from '~utils/request';
import { GetUserQueryKey } from '../keys';
import { User } from '~types/index';

const getUser = async (params) => {
  const result = await request({
    method: 'get',
    url: `/user/${params.id}`,
  });

  return result.data as User | undefined;
};

export default function useGetUser (getUserQueryKey: GetUserQueryKey, options?) {
  const [, params] = getUserQueryKey;

  return useQuery(
    getUserQueryKey,
    async () => {
      return await getUser(params);
    },
    options,
  );
}
