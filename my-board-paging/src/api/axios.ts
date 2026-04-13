import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8080/api",
// });

const api = axios.create({
  baseURL: "/api",
});

export default api;
