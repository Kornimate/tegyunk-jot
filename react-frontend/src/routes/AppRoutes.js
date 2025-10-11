import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { DashBoard } from "../pages/DashBoard";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminLayout } from "../layouts/AdminLayout";
import { VisitorLayout } from "../layouts/VisitorLayout";
import { NotFound } from "../pages/NotFound";

export const AppRoutes = () => {
  return (
    <Router basename="/tegyunk-jot">
      <Routes>
        <Route path="/" element={<VisitorLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/auth/login" element={<Login />} />
        <Route
          path="/admin/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashBoard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};
