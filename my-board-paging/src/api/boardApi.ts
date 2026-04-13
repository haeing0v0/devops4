import api from "./axios";
import type { BoardDto, BoardListResponse, Criteria } from "../types/Community";

export const boardApi = {
  getList: async (cri: Criteria): Promise<BoardListResponse> => {
    const res = await api.get<BoardListResponse>("/board/list", {
      params: cri,
    });
    return res.data;
  },
  getDetail: async (boardId: number): Promise<BoardDto> => {
    const res = await api.get<BoardDto>(`/board/detail/${boardId}`);
    return res.data;
  },
  insert: async (formData: FormData) => {
    const res = await api.post("/board/insert", formData);
    return res.data;
  },
  update: async (formData: FormData) => {
    const res = await api.put("/board/update", formData);
    return res.data;
  },
  delete: async (boardId: number) => {
    const res = await api.delete(`/board/delete/${boardId}`);
    return res.data;
  },
  deleteFile: async (fileIdx: number) => {
    const res = await api.delete(`/board/file/${fileIdx}`);
    return res.data;
  },
};
