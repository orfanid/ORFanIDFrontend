import axios from 'axios';
import config from './api.config';
import { getHeaders } from './api-helpers';

const analysisAPI = {
  getAll() {
    return axios({
      method: 'post',
      url: `${config.baseUrl()}/all-analysis`,
      headers: getHeaders(),
    });
  },
  getById(id) {
    return axios({
      method: 'get',
      url: `${config.baseUrl()}/analysis/${id}`,
      headers: getHeaders(),
    });
  },
  getByDesc(page, itemsPerPage, itemsSort) {
    return axios({
      method: 'get',
      url: `${config.baseUrl()}/all-analysis/paged?page=${page}&size=${itemsPerPage}&sortByDate=${itemsSort}`,
      headers: getHeaders(),
    });
  },
  saveAnalysis(values) {
    console.log('saveAnalysis');
    console.log(values);
    return axios({
      method: 'post',
      url: `${config.baseUrl()}/save`,
      data: values,
      headers: getHeaders(),
    });
  },
  getAnalysis(values) {
    return axios({
      method: 'post',
      url: `${config.baseUrl()}/data/analysis`,
      data: values,
      headers: getHeaders(),
    });
  },
  analyse(values) {
    return axios({
      method: 'post',
      url: `${config.baseUrl()}/analyse`,
      data: values,
      headers: getHeaders(),
    });
  },
  cancelAnalyse(analyseId) {
    return axios({
      method: 'get',
      url: `${config.baseUrl()}/analysis/cancel/${analyseId}`,
      headers: getHeaders()
    });
  },
  getSummaryChart(values) {
    return axios({
      method: 'post',
      url: `${config.baseUrl()}/data/summary/chart`,
      data: values,
      headers: getHeaders(),
    });
  },
  getBlastSummary(values) {
    return axios({
      method: 'post',
      url: `${config.baseUrl()}/data/blast`,
      data: values,
      headers: getHeaders(),
    });
  },
  downloadBlast(id) {
    return axios({
      method: 'get',
      url: `${config.baseUrl()}/download/blast/${id}`,
      headers: getHeaders(),
      responseType: 'blob',
    });
  },
  getOrganismList() {
    return axios({
      method: 'get',
      url: `../data/organism_list.json`
    });
  },
  orfanBaseGenes() {
    return axios({
      method: 'post',
      url: `${config.baseUrl()}/orfanbase-genes`,
      headers: getHeaders(),
    });
  },
  validate(values) {
    return axios({
      method: 'get',
      url: `${config.baseUrl()}/validate/accessions?accessions=${values.accessions}&accessionType=${values.accessionType}`,
      headers: getHeaders()
    });
  },
  validateOrganism(values) {
    if(values == null || values == "")
    return new Promise((resolve, reject) => {
      return reject(true);
    })

    return axios({
      method: 'get',
      url: `${config.baseUrl()}/validate-organism/${values}`,
      headers: getHeaders()
    }).then(function (response) {
      return new Promise((resolve, reject) => {
        return resolve(Boolean(response.data.isValid));
      })
    })
    .catch(function (error) {
      return new Promise((resolve, reject) => {
        return reject(false);
      })
    })
  },
  orfanBaseGenesByPage(currentPage, pageSize) {
    return axios({
      method: 'get',
      url: `${config.baseUrl()}/orfanbase-genes/paged?page=${currentPage}&size=${pageSize}`,
      headers: getHeaders(),
    });
  },
  getBotResponse(request) {
   return axios({
      method: 'post',
      url: `http://45.56.72.250:9000/chat`,
      data: request,
      headers: getHeaders(),
    });
  }
};

export default analysisAPI;
