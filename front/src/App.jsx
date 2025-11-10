import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Comprar from './pages/Comprar';
import Pontos from './pages/Pontos';
import Vendedor from './pages/Vendedor';

// Componente para proteger rotas
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-2xl">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/comprar"
        element={
          <ProtectedRoute>
            <Comprar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pontos"
        element={
          <ProtectedRoute>
            <Pontos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendedor"
        element={
          <ProtectedRoute>
            <Vendedor />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
