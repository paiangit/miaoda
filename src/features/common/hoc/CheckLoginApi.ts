import request from '../../../common/request';

export default {
  checkLogin() {
    return request({
      method: 'post',
      url: '/auth/checkLogin',
    });
  },
};
