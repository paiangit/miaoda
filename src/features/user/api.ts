import request from '../../common/request.ts';

export default {
  getUser(id) {
    return request({
      method: 'get',
      url: `/user/${id}`,
    });
  },
}
