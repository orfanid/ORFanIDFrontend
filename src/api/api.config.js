//const apiVersion = 1;
const config = {
  baseUrl() {
    return "http://107.218.5.220:8085";
  },
  axiosConfig() {
    return {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
      },
    };
  },
};

export default config;
