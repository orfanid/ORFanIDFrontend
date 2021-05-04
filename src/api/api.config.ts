const apiVersion = 1;
const config = {
  baseUrl() {
    return 'http://localhost:8081'; // `${window.runtimeConfig.apiHost}/api/v${apiVersion}`
  },
  axiosConfig() {
    return {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        /* Authorization: (function() {
          return 'Bearer ' + localStorage.token
        })(), */
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
      },
    };
  },
};

export default config;
