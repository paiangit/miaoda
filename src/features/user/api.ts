import request from '../../common/request';

export default {
  getUser(id: string) {
    return request({
      method: 'get',
      url: `/user/${id}`,
    });
  },
};
