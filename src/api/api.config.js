//const apiVersion = 1;
const config = {
  baseUrl() {
    return "https://orfanid.com/orfanidbe";
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
