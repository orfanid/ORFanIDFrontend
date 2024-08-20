import orfanAxio from '../api/orfanAxio';

const orfanApiService = {
  getAll() {
    return orfanAxio({
      method: 'post',
      url: `/all-analysis`,
  })
},
  getById(id) {
    return orfanAxio({
      method: 'get',
      url: `/analysis/${id}`,
    });
  },
  saveAnalysis(values) {
    return orfanAxio({
      method: 'post',
      url: `/save`,
      data: values,
    });
  },
  getAnalysis(values) {
    return orfanAxio({
      method: 'post',
      url: `/data/analysis`,
      data: values,
  })
},
  analyse(values) {
    return orfanAxio({
      method: 'post',
      url: `/analyse`,
      data: values,
  });
},
  cancelAnalyse(analyseId) {
    return orfanAxio({
      method: 'get',
      url: `/analysis/cancel/${analyseId}`,
  })
},
  getSummaryChart(values) {
    return orfanAxio({
      method: 'post',
      url: `/data/summary/chart`,
      data: values,
  })
},
  getBlastSummary(values) {
    return orfanAxio({
      method: 'post',
      url: `/data/blast`,
      data: values,
    });
  },
  downloadBlast(id) {
    return orfanAxio({
      method: 'get',
      url: `/download/blast/${id}`,
  })
},
  getOrganismList() {
    return orfanAxio({
      method: 'get',
      url: `../data/organism_list.json`
    });
  },
  orfanBaseGenes() {
    return orfanAxio({
      method: 'post',
      url: `/orfanbase-genes`,
    });
  },
  validate(values) {
    return orfanAxio({
      method: 'get',
      url: `/validate/accessions?accessions=${values.accessions}&accessionType=${values.accessionType}`,
    });
  },
  validateOrganism(values) {
    if(values == null || values == "")
    return new Promise((resolve, reject) => {
      return reject(true);
    })

    return orfanAxio({
      method: 'get',
      url: `/validate-organism/${values}`,
    }).then(function (response) {
      return new Promise((resolve) => {
        return resolve(Boolean(response.data.isValid));
      })
    })
    .catch(function () {
      return new Promise((resolve, reject) => {
        return reject(false);
      })
    })
  },
  orfanBaseGenesByPage(currentPage, pageSize) {
    return orfanAxio({
      method: 'get',
      url: `/orfanbase-genes/paged?page=${currentPage}&size=${pageSize}`,
    });
  },
  getBotResponse(request) {
   return orfanAxio({
      method: 'post',
      url: `http://45.56.72.250:9000/chat`,
      data: request,
    });
  }
};

export default orfanApiService;
