import request from '../../common/request';

export default {
  createUser(data) {
    return request({
      method: 'post',
      url: '/user/create',
      data,
    });
  },
  login(data) {
    return request({
      method: 'post',
      url: '/auth/login',
      data,
    });
  },
};
