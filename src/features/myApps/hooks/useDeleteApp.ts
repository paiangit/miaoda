import { message } from 'antd';
import { useMutation } from 'react-query';
import request from '../../../common/utils/request';

// 类型声明
export interface DeleteAppResult {
  data: {
    isSuccess: boolean;
  };
}

// 接口封装层
export const deleteApp = async (id: number) => {
  const result = await request({
    method: 'delete',
    url: `/app/${id}`,
  });

  return result.data as DeleteAppResult | undefined;
};

// hook封装层
export default function useDeleteApp () {
  return useMutation((id: number) => deleteApp(id), {
    onSuccess(data, variables, context) {
      message.success('删除成功！');
    },
    onError(err: Error, variables, context) {
      console.error('删除失败', err.message);
      message.error('删除失败！');
    },
  });
};
