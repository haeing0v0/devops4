import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BoardList from "./page/BoardList";
import BoardDetail from "./page/BoardDetail";
import BoardWrite from "./page/BoardWrite";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BoardList />} />
        <Route path="/board" element={<BoardList />} />
        <Route path="/board/:boardId" element={<BoardDetail />} />
        <Route path="/board/write" element={<BoardWrite />} />
        <Route path="/board/edit/:boardId" element={<BoardWrite />} />
      </Routes>
    </Router>
  );
}

export default App;
