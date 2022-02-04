import request from '../../common/request';

export default {
  getUser(id) {
    return request({
      method: 'get',
      url: `/user/${id}`,
    });
  },
};
