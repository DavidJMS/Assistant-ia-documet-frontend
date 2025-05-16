import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./layouts/DashboardLayout";
import UploadPage from "./pages/UploadPage";
import AskPage from "./pages/AskPage";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/ask" element={<AskPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
