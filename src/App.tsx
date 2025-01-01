import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CreatePage, LandingPage } from "./pages";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create" element={<CreatePage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
