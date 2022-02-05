import { request } from '../../common/utils/request';

export default {
  getUser(id: string) {
    return request({
      method: 'get',
      url: `/user/${id}`,
    });
  },
};
