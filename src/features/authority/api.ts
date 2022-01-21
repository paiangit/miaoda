import request from '../../common/request.ts';

export default {
  createUser(data) {
    return request({
      method: 'post',
      url: '/user/create',
      data,
    });
  },
  signIn(data) {
    return request({
      method: 'post',
      url: '/auth/signIn',
      data,
    });
  },
}
