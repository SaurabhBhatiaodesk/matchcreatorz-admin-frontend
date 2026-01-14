import { Suspense, memo } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "./layout/Layout";
import { ROUTE_PATHS } from "./routes/routePaths";
import { privateRoutes, publicRoutes } from "./routes/routes";
import { useAuthStore } from "./store/auth/authStore";
import { Loader } from "./components";
import { SocketProvider } from "./context/SocketContext";

const PublicRoutes = memo(() => {
  return (
    <Routes>
      {publicRoutes.map((route) => {
        return (
          <Route
            key={route?.path}
            path={route?.path}
            Component={route?.element}
          />
        );
      })}
      <Route path="*" element={<Navigate to={ROUTE_PATHS.LOGIN} />} />
    </Routes>
  );
});

const PrivateRoutes = memo(() => {
  return (
    <Layout>
      <Routes>
        {privateRoutes.map((route) => (
          <Route
            key={route?.path + "_xpat"}
            path={route?.path}
            Component={route?.element}
          />
        ))}
        <Route path="*" element={<Navigate to={ROUTE_PATHS.DASHBOARD} />} />
      </Routes>
    </Layout>
  );
});

function App() {
  const { isLogin } = useAuthStore();
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
      <ToastContainer autoClose={3000} limit={1} />
      <Suspense fallback={<Loader />}>
        {!isLogin ? <PublicRoutes /> : <PrivateRoutes />}
      </Suspense>
      </SocketProvider>
    </QueryClientProvider>
  );
}

export default App;

