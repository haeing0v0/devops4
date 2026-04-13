import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { boardApi } from "../api/boardApi";
import type { BoardDto, FileDto } from "../types/Community";
import "./BoardWrite.css";

const BoardWrite: React.FC = () => {
  const { boardId } = useParams<{ boardId?: string }>();
  const navigate = useNavigate();
  const isEditMode = !!boardId;

  const [form, setForm] = useState({
    title: "",
    contents: "",
    creatorId: "",
  });

  const [existingFiles, setExistingFiles] = useState<FileDto[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);

  useEffect(() => {
    if (!isEditMode || !boardId) return;

    boardApi
      .getDetail(Number(boardId))
      .then((data: BoardDto) => {
        setForm({
          title: data.title,
          contents: data.contents,
          creatorId: data.creatorId,
        });
        setExistingFiles(data.fileList || []);
      })
      .catch((e) => {
        console.error(e);
        alert("게시글 정보 조회 실패");
      });
  }, [isEditMode, boardId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteFile = async (fileIdx: number) => {
    if (!window.confirm("기존 파일을 삭제하시겠습니까?")) return;

    try {
      await boardApi.deleteFile(fileIdx);
      setExistingFiles((prev) =>
        prev.filter((file) => file.fileIdx !== fileIdx),
      );
      alert("파일 삭제 성공");
    } catch (e) {
      console.error(e);
      alert("파일 삭제 실패");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("제목을 입력하세요.");
      return;
    }

    if (!form.contents.trim()) {
      alert("내용을 입력하세요.");
      return;
    }

    if (!isEditMode && !form.creatorId.trim()) {
      alert("작성자를 입력하세요.");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("contents", form.contents);
    formData.append("creatorId", form.creatorId);

    if (isEditMode && boardId) {
      formData.append("boardId", boardId);
    }

    if (files) {
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });
    }

    try {
      if (isEditMode) {
        await boardApi.update(formData);
        alert("수정 성공");
      } else {
        await boardApi.insert(formData);
        alert("등록 성공");
      }
      navigate("/board");
    } catch (e) {
      console.error(e);
      alert(isEditMode ? "수정 실패" : "등록 실패");
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">
        {isEditMode ? "게시글 수정" : "게시글 등록"}
      </h2>

      <form className="board-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>제목</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="제목을 입력하세요."
          />
        </div>

        <div className="form-group">
          <label>내용</label>
          <textarea
            name="contents"
            value={form.contents}
            onChange={handleChange}
            placeholder="내용을 입력하세요."
          />
        </div>

        {!isEditMode && (
          <div className="form-group">
            <label>작성자</label>
            <input
              type="text"
              name="creatorId"
              value={form.creatorId}
              onChange={handleChange}
              placeholder="작성자를 입력하세요."
            />
          </div>
        )}

        {isEditMode && (
          <div className="form-group">
            <label>기존 첨부파일</label>
            <div className="existing-file-box">
              {existingFiles.length > 0 ? (
                existingFiles.map((file) => (
                  <div key={file.fileIdx} className="existing-file-item">
                    <span>{file.originalFileName}</span>
                    <button
                      type="button"
                      className="remove-file-btn"
                      onClick={() => handleDeleteFile(file.fileIdx)}
                    >
                      삭제
                    </button>
                  </div>
                ))
              ) : (
                <div className="empty-file">첨부파일이 없습니다.</div>
              )}
            </div>
          </div>
        )}

        <div className="form-group">
          <label>첨부파일</label>
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(e.target.files)}
          />
          <p className="file-help">여러 파일을 선택할 수 있습니다.</p>
        </div>

        <div className="form-btn-group">
          <button type="submit" className="submit-btn">
            {isEditMode ? "수정하기" : "저장"}
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/board")}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default BoardWrite;
