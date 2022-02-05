import { request } from '../../common/utils/request';

export default {
  getApp(id: string) {
    return request({
      method: 'get',
      url: `/app/${id}`,
    });
  },
  updateApp(id: string, data: object) {
    return request({
      method: 'put',
      url: `/app/${id}`,
      data,
    });
  },
};
