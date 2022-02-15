import { useParams } from 'react-router-dom';
import { prefixKey } from '../../common/utils';

const moduleName = '__user__';
const prefix = (key) => prefixKey(key, moduleName);

export type GetUserQueryKey = [
  string,
  {
    id: string;
  }
];

export const useGetUserQueryKey = () => {
  const { userId } = useParams();

  const params = {
    id: userId,
  };

  return [prefix('getUser'), params] as GetUserQueryKey;
};
