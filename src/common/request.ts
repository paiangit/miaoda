import axios, { AxiosInstance } from 'axios';
import { message } from 'antd';

const axiosInstance: AxiosInstance = axios.create(getDefaultOptions());

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    token && (config.headers.common['Authorization'] = token);
    config.headers['Content-Type'] = 'application/json';
    // 注意这里要return
    return config;
  },
  (err) => {
    console.log(err);
    // 注意这里要return
    return Promise.reject(err);
  }
);

axiosInstance.interceptors.response.use(
  (res: any) => {
    // const { status, data, message } = res;
    // let msg = '';

    // switch (status) {
    //   case 401:
    //     msg = '您的登录已过期，请重新登录';
    //     setTimeout(() => {
    //       const redirectURL = `https://localhost/auth/login?redirect=${encodeURIComponent(window.location.href)}`;
    //       window.location.href = redirectURL;
    //     }, 1000);
    //     break;
    //   case 404:
    //     msg = '无法找到该页面';
    //     window.location.href = '/404';
    //     break;
    //   case 403:
    //     msg = '您没有权限访问该页面';
    //     window.location.href = '/403';
    //     break;
    //   case 500:
    //     msg = '500 服务器异常，请稍后重试';
    //     break;
    //   case 0:
    //     msg = '网络开小差了，请稍后再试';
    //     break;
    //   default:
    //     msg = '服务器异常，请重新尝试';
    // }
    // 注意这里要return
    return Promise.resolve(res.data);
  },
  (err) => {
    const showError = message.error;

    if (err.message) {
      const msg = err.response?.data?.message || err.message;
      showError(msg);
    }
    // 注意这里要return
    return Promise.reject(err);
  }
);

function getDefaultOptions() {
  // API基地址
  const baseURL = `${window.location.protocol}//${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_API_PREFIX}`;
  // 超时时间
  const timeout = 60000;

  return {
    baseURL,
    timeout,
  };
}

function getToken() {
  const token = window.localStorage.getItem(
    process.env.REACT_APP_ACCESS_TOKEN_KEY
  );

  return token ? `Bearer ${token}` : '';
}

export default axiosInstance;
