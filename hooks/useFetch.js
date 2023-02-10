import { getAccessToken } from "../utils/authority.js";

export const useFetchGet = (url) => {
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  })
    .then(async (res) => {
      const resState = await res;
      const resData = await res.json();

      if (resState.status == 200) {
        return {
          statusCode: resState.status,
          response: resData,
        };
      } else {
        return {
          response: null,
          msg: resData.message,
          statusCode: resState.status,
        };
      }
    })
    .catch((err) => {
      return { data: null, error: err };
    });
};
/*
  hàm này sử dụng cho phương thức PUT, POST, DELETE
  ** params **
  url: đường dẫn api
  method: [PUT, POST, DELETE, PATCH]
  headers: object,
  body: chuỗi param sau khi convert json -> string [JSON.stringify(...)]
*/
export const useEffectAction = (url, method, headers, body) => {
  return fetch(url, {
    headers: {
      ...headers,
      Authorization: `Bearer ${getAccessToken(process.env.ACCESS_TOKEN_KEY)}`,
    },
    method,
    body,
  })
    .then(async (res) => {
      const resState = await res;
      const resData = await res.json();
      if (resState.status != 200) {
        return {
          response: null,
          msg: resData.message,
          statusCode: resState.status,
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

export default { useFetchGet, useEffectAction };
