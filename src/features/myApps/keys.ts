/**
 * 汇总请求 key 的意义在于：
 * 1）调取全局 client 进行重复请求或者阻断、获取缓存都是会模糊匹配 key list 的，汇总 key 为可能的全局操作提供便利；
 * 2）一个有意义的 key 可以帮助你在 react-query/devtools 里快速分辨是什么请求。
 */
import { useParams } from 'react-router-dom';
import prefixKey from '~utils/prefixKey';
import useUrlQueryParams from '~hooks/useUrlQueryParams';

const moduleName = '__myApps__';
const prefix = (key) => prefixKey(key, moduleName);

export type GetAppListQueryKey = [
  string,
  {
    title: string;
    pageSize: number;
    offset: number;
  }
];

export const useGetAppListQueryKey = () => {
  const { userId } = useParams();
  const [urlQueryParams] = useUrlQueryParams(['keyword', 'page', 'pageSize']);
  const pageSize = +urlQueryParams.pageSize;
  const page = +urlQueryParams.page;

  const params = {
    title: urlQueryParams.keyword,
    pageSize,
    offset: (page - 1) * pageSize,
    userId,
  };

  return [prefix('getAppList'), params] as GetAppListQueryKey;
};
