import { useMutation } from 'react-query';
import { request } from '../../../common/utils';
import { App } from '../../../common/types';
import { message } from 'antd';

interface UpdateAppParams {
  data: App;
}

interface UpdateAppResult {
  isSuccess: boolean;
}

export const updateApp = async (id: number, params: UpdateAppParams) => {
  const result = await request({
    method: 'put',
    url: `/app/${id}`,
    data: params,
  });

  return result.data as UpdateAppResult | undefined;
};

export const useUpdateApp = (id) => {
  return useMutation(async (params: UpdateAppParams) => updateApp(id, params), {
    onSuccess(data, variables, context) {
      message.success('保存成功！');
    },
    onError(err, variables, context) {
      console.log('保存失败', err);
      message.error('保存失败！');
    },
  });
};
