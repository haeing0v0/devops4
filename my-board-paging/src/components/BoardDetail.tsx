import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { boardApi } from "../api/axiosinstance";
import type { BoardDto } from "../types/Board";
import "./BoardDetail.css";

const BoardDetail: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();

  const [board, setBoard] = useState<BoardDto | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", contents: "" });
  const [newFiles, setNewFiles] = useState<FileList | null>(null);

  const fetchDetailData = useCallback(async () => {
    try {
      if (boardId) {
        const data = await boardApi.getDetail(parseInt(boardId));
        setBoard(data);
        setEditForm({
          title: data.title || "",
          contents: data.contents || "",
        });
      }
    } catch (error) {
      console.error("데이터 로드 실패:", error);
      alert("데이터를 불러오지 못했습니다.");
      navigate("/");
    }
  }, [boardId, navigate]);

  useEffect(() => {
    fetchDetailData();
  }, [fetchDetailData]);

  const handleEditToggle = () => {
    if (isEditMode) {
      setEditForm({
        title: board?.title || "",
        contents: board?.contents || "",
      });
      setNewFiles(null);
    }
    setIsEditMode(!isEditMode);
  };

  const handleUpdate = async () => {
    if (!board) {
      return;
    }

    const formData = new FormData();
    formData.append("boardId", String(board.boardId));
    formData.append("title", editForm.title);
    formData.append("contents", editForm.contents);
    formData.append("creatorId", board.creatorId);
    formData.append("updaterId", board.creatorId || "admin");

    if (newFiles && newFiles.length > 0) {
      Array.from(newFiles).forEach((file) => {
        formData.append("files", file);
      });
    } else {
      formData.append("files", new File([], "empty.txt"));
    }

    try {
      await boardApi.update(board.boardId, formData);
      alert("수정 완료되었습니다.");

      setNewFiles(null);
      setIsEditMode(false);
      fetchDetailData();
    } catch (error: any) {
      console.error("수정 실패:", error);
      alert(`수정 실패: ${error.response?.data?.message || "서버 통신 오류"}`);
    }
  };

  const handleFileDelete = async (fileIdx: number) => {
    if (window.confirm("이 파일을 영구적으로 삭제하시겠습니까?")) {
      try {
        await boardApi.deleteFile(fileIdx);
        fetchDetailData();
      } catch (error) {
        alert("파일 삭제 실패");
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm("정말 이 게시글을 삭제하시겠습니까?")) {
      try {
        await boardApi.delete(board!.boardId);
        navigate("/");
      } catch (error) {
        alert("삭제 실패");
      }
    }
  };

  if (!board) {
    return <div className="detail-container">로딩 중....</div>;
  }

  return (
    <div className="detail-container">
      <h2 className="detail-title">
        {isEditMode ? "게시글 수정" : "게시글 상세"}
      </h2>
      <div className="detail-header">
        <div className="info-row">
          <span className="info-label">제목</span>
          {isEditMode ? (
            <input
              className="edit-input"
              value={editForm.title}
              onChange={(e) =>
                setEditForm({ ...editForm, title: e.target.value })
              }
            />
          ) : (
            <span className="info-value title-text">{board.title}</span>
          )}
        </div>

        <div className="info-grid">
          <div className="info-row">
            <span className="info-label">작성자</span>
            <span className="info-value">{board.creatorId}</span>
          </div>

          <div className="info-row">
            <span className="info-label">조회수</span>
            <span className="info-value">{board.hitCnt}</span>
          </div>

          <div className="info-row">
            <span className="info-label">작성일</span>
            <span className="info-value">{board.createdDatetime}</span>
          </div>
        </div>
      </div>

      <div className="detail-content">
        {isEditMode ? (
          <textarea
            className="edit-textarea"
            rows={15}
            value={editForm.contents}
            onChange={(e) =>
              setEditForm({ ...editForm, contents: e.target.value })
            }
          />
        ) : (
          board.contents?.split("\n").map((line, i) => (
            <p key={i} style={{ margin: 0, minHeight: "1.2em" }}>
              {line}
            </p>
          ))
        )}
      </div>

      <div className="detail-files">
        <h4 className="file-title">첨부파일 목록</h4>
        {board.fileList && board.fileList.length > 0 ? (
          board.fileList.map((f) => (
            <div key={f.fileIdx} className="file-item">
              <span>
                {f.originalFileName} ({f.fileSize.toLocaleString()} KB)
              </span>
              {isEditMode && (
                <button
                  type="button"
                  className="btn-file-del"
                  onClick={() => handleFileDelete(f.fileIdx)}
                >
                  [파일삭제]
                </button>
              )}
            </div>
          ))
        ) : (
          <span className="no-file">등록된 파일이 없습니다.</span>
        )}

        {isEditMode && (
          <div
            className="file-add-section"
            style={{
              marginTop: "15px",
              borderTop: "1px dashed #ddd",
              paddingTop: "10px",
            }}
          >
            <label style={{ fontSize: "14px", fontWeight: "bold" }}>
              새 파일 추가:{" "}
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => setNewFiles(e.target.files)}
            />
            <p style={{ fontSize: "12px", color: "#888", marginTop: "5px" }}>
              * 파일을 선택하면 기존 목록에 추가로 저장됩니다.
            </p>
          </div>
        )}
      </div>

      <div className="detail-btn-area">
        <button className="btn-list" onClick={() => navigate("/")}>
          목록으로
        </button>

        <div className="right-btns">
          {isEditMode ? (
            <>
              <button className="btn-save" onClick={handleUpdate}>
                저장
              </button>
              <button className="btn-cancel" onClick={handleEditToggle}>
                취소
              </button>
            </>
          ) : (
            <>
              <button className="btn-edit" onClick={handleEditToggle}>
                수정
              </button>

              <button className="btn-delete" onClick={handleDelete}>
                삭제
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardDetail;
