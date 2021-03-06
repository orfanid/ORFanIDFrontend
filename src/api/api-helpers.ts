import config from './api.config';

export const formatRequest = (request: any) => {
  if (!request) {
    return {};
  }
  return JSON.parse(JSON.stringify(request));
};

export const getHeaders = () => {
  const headers = formatRequest(config.axiosConfig().headers);

  return headers;
};
