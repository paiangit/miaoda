import { message } from 'antd';
import { useMutation } from 'react-query';
import { request } from '../../../common/utils';
import { MutationParams } from '../../../common/types';

// 类型声明
export interface DeleteAppParams extends MutationParams {
  id: number;
}
export interface DeleteAppResult {
  data: {
    isSuccess: boolean;
  };
}

// 接口封装层
export const deleteApp = async (params: DeleteAppParams) => {
  const result = await request({
    method: 'delete',
    url: `/app/${params.id}`,
  });

  return result.data as DeleteAppResult | undefined;
};

// hook封装层
export const useDeleteApp = () => {
  return useMutation((params: DeleteAppParams) => deleteApp(params), {
    onSuccess(data, variables, context) {
      message.success('删除成功！');
      // 执行传入的成功回调
      variables.onSuccess && variables.onSuccess();
    },
    onError(err: Error, variables, context) {
      console.error('删除失败', err.message);
      message.error('删除失败！');
      // 执行传入的失败回调
      variables.onError && variables.onError();
    },
  });
};
