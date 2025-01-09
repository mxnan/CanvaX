import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CreatePage, LandingPage } from "./pages";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <>
      {" "}
     
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />

            <Route path="/app" element={<CreatePage />} />
          </Routes>
        </Router>
        <Toaster offset={15} position="top-center" />{" "}
      
    </>
  );
}

export default App;
