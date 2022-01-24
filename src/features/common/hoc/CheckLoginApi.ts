import request from '../../../common/request.ts';

export default {
  checkLogin() {
    return request({
      method: 'post',
      url: '/auth/checkLogin',
    });
  },
}
