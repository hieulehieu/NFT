import axios from '@src/config/axios.conf';

export const getNfts = (params) => {
  return axios.get(`/nfts`, {
    params,
  });
};

export const importCollection = (data) => {
  return axios.post('/nfts/import', data);
};
