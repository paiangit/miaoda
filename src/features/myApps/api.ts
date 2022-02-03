import request from '../../common/request.ts';

export default {
  createApp(data) {
    return request({
      method: 'post',
      url: '/app/create',
      data,
    });
  },
};
