import axios from 'axios';
import config from './api.config';
import { getHeaders, formatRequest } from './api-helpers';

const analysisAPI = {
  getAll() {
    return axios({
      method: 'get',
      url: `${config.baseUrl()}/analysis`,
      headers: getHeaders(),
    });
  },
  getById(id: number) {
    return axios({
      method: 'get',
      url: `${config.baseUrl()}/analysis/${id}`,
      headers: getHeaders(),
    });
  },
  saveAnalysis(values: any) {
    console.log('saveAnalysis');
    console.log(values);
    return axios({
      method: 'post',
      url: `${config.baseUrl()}/analysis/analysis`,
      data: values,
      headers: getHeaders(),
    });
  },
};

export default analysisAPI;
