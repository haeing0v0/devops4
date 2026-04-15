package org.cloud.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.cloud.dto.BoardDto;
import org.cloud.dto.Criteria;
import org.cloud.dto.PageResponse;
import org.cloud.service.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.support.StandardMultipartHttpServletRequest;

import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/board")
public class BoardApiController {

	@Autowired
	private BoardService boardService;
	
	@GetMapping
	public ResponseEntity<Map<String, Object>> openBoardList(Criteria cri) throws Exception {
		if (cri.getPageNum() <= 0) {
			cri.setPageNum(1);
		}
		if (cri.getAmount() <= 0) {
			cri.setAmount(10);
		}
		
		List<BoardDto> list = boardService.selectBoardListPaging(cri);
		int total = boardService.selectBoardTotalCount();
		//int total = 500;
		Map<String, Object> response = new HashMap<String, Object>();
		response.put("list", list);
		response.put("pageMarker", new PageResponse(cri, total));
		
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@PostMapping
	public ResponseEntity<String> insertBoard(BoardDto board, MultipartHttpServletRequest multipartHttpServletRequest) throws Exception {
		boardService.insertBoard(board, multipartHttpServletRequest);
		return new ResponseEntity<String>("Success", HttpStatus.CREATED);
	}
	
	@GetMapping("/{boardId}")
	public ResponseEntity<BoardDto> openBoardDetail(@PathVariable("boardId") int boardId) throws Exception {
		BoardDto board = boardService.selectDetail(boardId);
		if (board != null) {
			return new ResponseEntity<BoardDto>(board, HttpStatus.OK);
		}
		return new ResponseEntity<BoardDto>(HttpStatus.NOT_FOUND);
	}
	
	@PostMapping("/update/{boardId}")
	public ResponseEntity<String> updateBoard(@PathVariable("boardId") int boardId, @ModelAttribute BoardDto board, HttpServletRequest request) throws Exception {
		
		board.setBoardId(boardId);
		MultipartHttpServletRequest multipartRequest = null;
		
		if (request instanceof MultipartHttpServletRequest) {
			multipartRequest = (MultipartHttpServletRequest) request;
		} else {
			multipartRequest = new StandardMultipartHttpServletRequest(request);
		}
		
		boardService.updateBoard(board, multipartRequest);
		
		return new ResponseEntity<String>("Update Success", HttpStatus.OK);
	}
	
	@DeleteMapping("/{boardId}")
	public ResponseEntity<String> deleteBoard(@PathVariable("boardId") int boardId) throws Exception {
		boardService.deleteBoard(boardId);
		return new ResponseEntity<String>("Delete Success", HttpStatus.OK);
	}
	
	@DeleteMapping("/file/{fileIdx}")
	public ResponseEntity<String> deleteFile(@PathVariable("fileIdx") int fileIdx) throws Exception {
		try {
			boardService.deleteFile(fileIdx);
			return new ResponseEntity<String>("success", HttpStatus.OK);
		} catch (Exception e) {
			// TODO: handle exception
			return new ResponseEntity<String>("fail", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
