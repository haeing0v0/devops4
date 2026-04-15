import axios from "axios";
import type { BoardDto, BoardListResponse, Criteria } from "../types/Board";

const instance = axios.create({
  baseURL: "/api/board",
});

export const boardApi = {
  getList: (cri: Criteria) =>
    instance
      .get<BoardListResponse>("", { params: cri })
      .then((res) => res.data),
  getDetail: (boardId: number) =>
    instance.get<BoardDto>(`/${boardId}`).then((res) => res.data),
  insert: (formData: FormData) => instance.post("", formData),
  update: (boardId: number, formData: FormData) =>
    instance.post(`/update/${boardId}`, formData),
  delete: (boardId: number) => instance.delete(`/${boardId}`),
  deleteFile: (fileIdx: number) => instance.delete(`/file/${fileIdx}`),
};

export default instance;
