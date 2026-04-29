import { Suspense, lazy, type ReactNode } from "react";
import { Route, Routes } from "react-router-dom";
import { useAuth } from "../lib/context/AuthContext";

// Lazy Loading das páginas para carregar os componentes somente quando necessários.
const LoginPage = lazy(() => import("../pages/LoginPage"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const ProductFormPage = lazy(() => import("../pages/ProductFormPage"));
const ProductDetailPage = lazy(() => import("../pages/ProductDetailPage"));
const GalleryDashboardPage = lazy(() => import("../pages/GalleryDashboardPage"));
const GalleryFormPage = lazy(() => import("../pages/GalleryFormPage"));
const GalleryDetailPage = lazy(() => import("../pages/GalleryDetailPage"));

// Componente de rota privada que utiliza o AuthContext para verificar
// se o usuário está autenticado antes de permitir o acesso.
function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  // Ainda não sabemos se o usuário está autenticado.
  if (isAuthenticated === null) {
    return <div>Verificando sessão...</div>;
  }

  // Usuário não autenticado: redireciona para /login.
  // Não renderiza o conteúdo protegido.
  if (isAuthenticated === false) {
    window.location.href = "/login";
    return null;
  }

  // Usuário autenticado: libera o acesso à rota.
  return children;
}

export function AppRoutes() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <Routes>
        {/* Rota pública de login: disponível sem autenticação. */}
        <Route path="/login" element={<LoginPage />} />

        {/* Página principal protegida: somente usuários autenticados podem acessar. */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />

        {/* Rotas de produto protegidas pelo AuthContext. */}
        <Route
          path="/products/new"
          element={
            <PrivateRoute>
              <ProductFormPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/products/:id"
          element={
            <PrivateRoute>
              <ProductDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/products/:id/edit"
          element={
            <PrivateRoute>
              <ProductFormPage />
            </PrivateRoute>
          }
        />

        {/* Rotas de galeria protegidas: listas, criação, detalhe e edição. */}
        <Route
          path="/galleries"
          element={
            <PrivateRoute>
              <GalleryDashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/galleries/new"
          element={
            <PrivateRoute>
              <GalleryFormPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/galleries/:id"
          element={
            <PrivateRoute>
              <GalleryDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/galleries/:id/edit"
          element={
            <PrivateRoute>
              <GalleryFormPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}