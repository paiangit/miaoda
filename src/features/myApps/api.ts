import request from '../../common/request';

export default {
  createApp(data: object) {
    return request({
      method: 'post',
      url: '/app/create',
      data,
    });
  },
  getAppList(params: object) {
    return request({
      method: 'get',
      url: '/app/list',
      params,
    });
  },
  deleteApp(id: string) {
    return request({
      method: 'delete',
      url: `/app/${id}`,
    });
  },
};
