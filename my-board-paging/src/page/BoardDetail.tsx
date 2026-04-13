import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { boardApi } from "../api/boardApi";
import type { BoardDto, FileDto } from "../types/Community";
import "./BoardDetail.css";

const BoardDetail: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<BoardDto | null>(null);

  useEffect(() => {
    if (!boardId) return;

    boardApi
      .getDetail(Number(boardId))
      .then((data) => setDetail(data))
      .catch((e) => {
        console.error(e);
        alert("상세 조회 실패");
      });
  }, [boardId]);

  const handleDelete = async () => {
    if (!detail) return;

    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await boardApi.delete(detail.boardId);
      alert("삭제 성공");
      navigate("/board");
    } catch (e) {
      console.error(e);
      alert("삭제 실패");
    }
  };

  const handleDeleteFile = async (fileIdx: number) => {
    if (!window.confirm("파일을 삭제하시겠습니까?")) return;

    try {
      await boardApi.deleteFile(fileIdx);
      setDetail((prev) =>
        prev
          ? {
              ...prev,
              fileList: prev.fileList.filter(
                (file) => file.fileIdx !== fileIdx,
              ),
            }
          : prev,
      );
      alert("파일 삭제 성공");
    } catch (e) {
      console.error(e);
      alert("파일 삭제 실패");
    }
  };

  if (!detail) {
    return <div className="detail-loading">로딩 중...</div>;
  }

  return (
    <div className="detail-container">
      <h2 className="detail-title">게시글 상세조회</h2>

      <div className="detail-card">
        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">글번호</span>
            <span className="detail-value">{detail.boardId}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">조회수</span>
            <span className="detail-value">{detail.hitCnt}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">작성자</span>
            <span className="detail-value">{detail.creatorId}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">작성일</span>
            <span className="detail-value">{detail.createdDatetime}</span>
          </div>
        </div>

        <div className="detail-section">
          <label className="detail-section-label">제목</label>
          <div className="detail-text-box">{detail.title}</div>
        </div>

        <div className="detail-section">
          <label className="detail-section-label">내용</label>
          <div className="detail-content-box">{detail.contents}</div>
        </div>

        <div className="detail-section">
          <label className="detail-section-label">첨부파일</label>
          <div className="file-list-box">
            {detail.fileList && detail.fileList.length > 0 ? (
              detail.fileList.map((file: FileDto) => (
                <div key={file.fileIdx} className="file-item">
                  <a
                    href={file.storedFilePath}
                    target="_blank"
                    rel="noreferrer"
                    className="file-link"
                  >
                    {file.originalFileName}
                  </a>
                  <button
                    className="file-delete-btn"
                    onClick={() => handleDeleteFile(file.fileIdx)}
                  >
                    파일삭제
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-file">첨부파일이 없습니다.</div>
            )}
          </div>
        </div>

        <div className="detail-btn-group">
          <button
            className="detail-btn list"
            onClick={() => navigate("/board")}
          >
            목록으로
          </button>
          <button
            className="detail-btn edit"
            onClick={() => navigate(`/board/edit/${detail.boardId}`)}
          >
            수정하기
          </button>
          <button className="detail-btn delete" onClick={handleDelete}>
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardDetail;
