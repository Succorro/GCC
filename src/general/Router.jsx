import { Route, Routes } from "react-router-dom";
import { LoginForm } from "../admin/components/LoginForm.jsx";
import { RoutePaths } from "./RoutePaths.jsx";
import { Home } from "../home/Home.jsx";
import { NotFound } from "./NotFound.jsx";
import { Layout } from "./Layout.jsx";
import { ProtectedRoute } from "../admin/components/ProtectedRoute.jsx";
import { AdminLayout } from "../admin/components/AdminLayout.jsx";
import Navigation from '../Navigation.jsx'
import { SettingsForm } from "../admin/components/SettingsForm.jsx";

export const Router = () => (
  <Routes>
    <Route path={RoutePaths.LOGIN} element={<LoginForm />} />
    <Route path='/devAdmin' element={<AdminLayout />} />
    <Route
      path={RoutePaths.ADMIN}
      element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }
    />
    <Route
      path={RoutePaths.HOME}
      element={
        <Layout>
          <Navigation />
          <Home />
        </Layout>
      }
    />
    <Route
      path="*"
      element={
        <Layout>
          <NotFound />
        </Layout>
      }
    />
  </Routes>
);
