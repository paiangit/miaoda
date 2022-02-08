import { request } from '../../common/utils';

export default {
  getUser(id: string) {
    return request({
      method: 'get',
      url: `/user/${id}`,
    });
  },
};
