const TOKEN_NAME = "token";

export const setAuthToken = (token) => {
  sessionStorage.setItem(TOKEN_NAME, token);
};

export const getAuthToken = () => {
  return sessionStorage.getItem(TOKEN_NAME);
};
