import { getAuthToken } from "./utils";
import { AuthContext } from "./contexts";
// const BASE_URL = "https://student-json-api.lidemy.me";
const BASE_URL = "https://blogdemo-api.herokuapp.com";

export const getPosts = () => {
  return fetch(`${BASE_URL}/posts?_sort=createdAt&_order=desc`).then((res) =>
    res.json()
  );
};
export const getPost = (PostID) => {
  return fetch(`${BASE_URL}/posts/${PostID}`).then((res) => res.json());
};
export const getUser = () => {
  return fetch(`https://blogdemo-api.herokuapp.com/users`).then((res) =>
    res.json()
  );
};
export const newPost = (title, body, nickname) => {
  const token = getAuthToken(AuthContext);
  return fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      nickname,
      title,
      body,
      comments: [],
    }),
  }).then((res) => res.json());
};

export const editPost = (userId, PostID, title, body, createdAt, editAt) => {
  const token = getAuthToken(AuthContext);
  return fetch(`${BASE_URL}/posts/${PostID}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      userId,
      createdAt,
      editAt,
      title,
      body,
    }),
  }).then((res) => res.json());
};

export const delPost = (id) => {
  return fetch(`${BASE_URL}/posts/${id}`, {
    method: "DELETE",
  }).then((res) => res.json());
};

export const login = (username, password) => {
  return fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  }).then((res) => res.json());
};

export const reg = (username, password, nickname) => {
  return fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      nickname,
    }),
  }).then((res) => res.json());
};

export const getMe = () => {
  const token = getAuthToken();
  return fetch(`${BASE_URL}/me`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
};

export const arthurPost = (arthurID) => {
  return fetch(
    `${BASE_URL}/posts?userId=${arthurID}&_sort=createdAt&_order=desc`
  ).then((res) => res.json());
};

export const myPost = (user) => {
  return fetch(
    `${BASE_URL}/posts?userId=${user.id}&_sort=createdAt&_order=desc`
  ).then((res) => res.json());
};
