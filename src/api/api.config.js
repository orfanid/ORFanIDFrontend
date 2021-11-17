//const apiVersion = 1;
const config = {
  baseUrl() {
    return "http://51.81.208.211:8085";
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
