import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/context/AuthContext";
import { AppRoutes } from "./routes/routes";

// Cria a instância do QueryClient para cache de dados do React Query.
const queryClient = new QueryClient();

function AppContent() {
  const { isAuthenticated } = useAuth();

  // Enquanto o AuthContext valida a sessão, não renderiza as rotas.
  if (isAuthenticated === null) {
    return <div>Verificando sessão...</div>;
  }

  // Uma vez autenticado, o BrowserRouter e as rotas protegidas são exibidos.
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

function App() {
  return (
    // O AuthProvider injeta o estado de autenticação no contexto para toda a aplicação.
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
