import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { boardApi } from "../api/boardApi";
import type { BoardDto, Criteria, PageResponse } from "../types/Community";
import "./BoardList.css";

const BoardList: React.FC = () => {
  const [list, setList] = useState<BoardDto[]>([]);
  const [pageMaker, setPageMaker] = useState<PageResponse | null>(null);
  const [cri, setCri] = useState<Criteria>({
    pageNum: 1,
    amount: 10,
    skip: 0,
  });

  useEffect(() => {
    const fetchList = async () => {
      try {
        const data = await boardApi.getList(cri);
        setList(data?.list ?? []);
        setPageMaker(data?.pageMaker ?? null);
      } catch (e) {
        console.error(e);
        setList([]);
        setPageMaker(null);
        alert("게시글 목록 조회 실패");
      }
    };

    fetchList();
  }, [cri.pageNum, cri.amount]);

  const movePage = (pageNum: number) => {
    setCri((prev) => ({
      ...prev,
      pageNum,
      skip: (pageNum - 1) * prev.amount,
    }));
  };

  const renderPageButtons = () => {
    if (!pageMaker) return null;

    const buttons = [];
    for (let i = pageMaker.startPage; i <= pageMaker.endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`page-btn ${cri.pageNum === i ? "active" : ""}`}
          onClick={() => movePage(i)}
        >
          {i}
        </button>,
      );
    }
    return buttons;
  };

  return (
    <div className="list-container">
      <h2 className="list-title">게시글 목록</h2>

      <table className="board-table">
        <thead>
          <tr>
            <th style={{ width: "10%" }}>번호</th>
            <th style={{ width: "45%" }}>제목</th>
            <th style={{ width: "15%" }}>조회수</th>
            <th style={{ width: "15%" }}>작성자</th>
            <th style={{ width: "15%" }}>작성일</th>
          </tr>
        </thead>
        <tbody>
          {list && list.length > 0 ? (
            list.map((board) => (
              <tr key={board.boardId}>
                <td>{board.boardId}</td>
                <td style={{ textAlign: "left" }}>
                  <Link className="title-link" to={`/board/${board.boardId}`}>
                    {board.title}
                  </Link>
                </td>
                <td>{board.hitCnt}</td>
                <td>{board.creatorId}</td>
                <td>{board.createdDatetime}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>조회된 결과가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      {pageMaker && (
        <div className="pagination">
          {pageMaker.prev && (
            <button
              className="page-nav-btn"
              onClick={() => movePage(pageMaker.startPage - 1)}
            >
              이전
            </button>
          )}

          {renderPageButtons()}

          {pageMaker.next && (
            <button
              className="page-nav-btn"
              onClick={() => movePage(pageMaker.endPage + 1)}
            >
              다음
            </button>
          )}
        </div>
      )}

      <div className="btn-area">
        <Link to="/board/write">
          <button className="btn-write">글쓰기</button>
        </Link>
      </div>
    </div>
  );
};

export default BoardList;
