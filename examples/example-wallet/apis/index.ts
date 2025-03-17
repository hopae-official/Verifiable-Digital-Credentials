import axios from 'axios';

export const testApi = async () => {
  const res = await axios.get('https://issuer.dev.hopae.com/start');
  return res.data;
};
