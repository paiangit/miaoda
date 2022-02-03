import request from '../../common/request.ts';

export default {
  getApp(id) {
    return request({
      method: 'get',
      url: `/app/${id}`,
    });
  },
  updateApp(id, data) {
    return request({
      method: 'put',
      url: `/app/${id}`,
      data,
    });
  },
};
