import { setCookie, getCookie, deleteCookie } from "cookies-next";
import jwt from "jwt-decode";

const ACCESS_TOKEN_KEY = "lGVSWkkXf8AMCWs8NxIsFHFjIKBrZzUq";
const REFRESH_TOKEN_KEY = "some-secret-refresh-token-shit";

// handle cookies
export const setCookieFn = (key, value, option = {}) => {
  setCookie(key, value, option);
};
export const getCookieFn = (key, option = {}) => getCookie(key, option);
const removeCookie = (key, option) => deleteCookie(key, option);

export const getAccessToken = (option = {}) =>
  getCookieFn(ACCESS_TOKEN_KEY, option);
export const setAccessToken = (value = "", option) =>
  setCookieFn(ACCESS_TOKEN_KEY, value, option);

export const getRefreshToken = (option = {}) =>
  getCookieFn(REFRESH_TOKEN_KEY, option);
export const setRefreshToken = (value = "", option) =>
  setCookieFn(REFRESH_TOKEN_KEY, value, option);

export const removeAccessToken = (option = {}) =>
  removeCookie(ACCESS_TOKEN_KEY, option);

export const removeRefreshToken = (option = {}) =>
  removeCookie(REFRESH_TOKEN_KEY, option);

// handle token
const jwtDecode = (token) => jwt(token);
export const isLoggedIn = () => {
  const idToken = getAccessToken();
  return !!idToken;
};
export const getUserInfoByToken = () => {
  if (isLoggedIn()) {
    const decode = jwtDecode(getAccessToken());
    return decode.data;
  }
  return null;
};
