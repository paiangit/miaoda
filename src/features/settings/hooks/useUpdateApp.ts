import { useMutation } from 'react-query';
import { request } from '../../../common/utils';
import { MutationParams, App } from '../../../common/types';
import { message } from 'antd';

interface UpdateAppParams extends MutationParams {
  data: App;
}

interface UpdateAppResult {
  isSuccess: boolean;
}

export const updateApp = async (id: number, params: UpdateAppParams) => {
  const result = await request({
    method: 'put',
    url: `/app/${id}`,
    data: params.data,
  });

  return result.data as UpdateAppResult | undefined;
};

export const useUpdateApp = (id) => {
  return useMutation(async (params: UpdateAppParams) => updateApp(id, params), {
    onSuccess(data, variables, context) {
      message.success('保存成功！');
      variables.onSuccess && variables.onSuccess();
    },
    onError(err, variables, context) {
      console.log('保存失败', err);
      message.error('保存失败！');
      variables.onError && variables.onError();
    },
  });
};
