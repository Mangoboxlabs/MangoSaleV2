import instance from '@/api/http';

export const confirmTransaction = (hash) => {
  return new Promise((resolve, reject) => {
    let loop = 1;
    let internalId = setInterval(() => {
      instance
        .get(`/api/trans-status?trans_hash=${hash}`)
        .then((ret) => {
          if (ret.data.data == 1) {
            resolve(ret.extra);
            clearInterval(internalId);
            return;
          }
          if (loop++ > 500) {
            reject(0);
            clearInterval(internalId);
          }
        })
        .catch((err) => {
          reject(err);
        });
    }, 1000);
  });
};

export const getTranStatus = (hash) => {
  return instance.get(`/api/trans-status?trans_hash=${hash}`);
};
export const emailSign = ({ email, signature, datetime, address }) => {
  return instance.post(`/api/update-email`, { email, signature, datetime, address });
};

export const getPersonInfo = (address) => {
  return instance.post(`/api/info`, { address });
};
export const readMessage = (address) => {
  return instance.post(`/api/message/read`, { address });
};

export const sendVerifyCode = ({ email, address }) => {
  return instance.post(`/api/send-verify-code`, { email, address });
};

export const verifyCode = ({ email, code }) => {
  return instance.post(`/api/verify`, { email, code });
};
