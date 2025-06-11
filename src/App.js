import Main from "./components/Main/Main.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BidHistoryPage from "./components/BidHistory/BidHistoryPage.js";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Main />} />

        <Route path="/moje-licitacije" element={<BidHistoryPage />} />
      </Routes>
    </div>
  );
}
export default App;
