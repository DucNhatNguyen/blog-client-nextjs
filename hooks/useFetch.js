import { getAccessToken } from "../utils/authority.js";

export const useFetchGet = (url) => {
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${getAccessToken(process.env.ACCESS_TOKEN_KEY)}`,
    },
  })
    .then(async (res) => {
      const resState = await res;
      const resData = await res.json();
      if (resState.status != 200) {
        return {
          response: resState.status,
          msg: resData,
          data: null,
        };
      } else {
        return {
          statusCode: resState.status,
          response: resData,
        };
      }
    })
    .catch((err) => {
      return { data: null, error: err };
    });
};

export default { useFetchGet };
