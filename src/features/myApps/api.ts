import request from '../../common/request.ts';

export default {
  createApp(data) {
    return request({
      method: 'post',
      url: '/app/create',
      data,
    });
  },
  getAppList(params) {
    return request({
      method: 'get',
      url: '/app/list',
      params,
    });
  },

  deleteApp(id) {
    return request({
      method: 'delete',
      url: `/app/${id}`,
    });
  },
};
