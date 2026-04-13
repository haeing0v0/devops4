export interface FileDto {
  fileIdx: number;
  boardId: number;
  originalFileName: string;
  storedFilePath: string;
  fileSize: number;
  creatorId: string;
}

export interface BoardDto {
  boardId: number;
  title: string;
  contents: string;
  hitCnt: number;
  createdDatetime: string;
  creatorId: string;
  updatedDatetime: string;
  updaterId: string;
  fileList: FileDto[];
}

export interface Criteria {
  pageNum: number;
  amount: number;
  skip: number;
}

export interface PageResponse {
  startPage: number;
  endPage: number;
  total: number;
  prev: boolean;
  next: boolean;
  cri: Criteria;
}

export interface BoardListResponse {
  list: BoardDto[];
  pageMaker: PageResponse;
}
