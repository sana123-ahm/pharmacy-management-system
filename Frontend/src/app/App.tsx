import { useState, useEffect } from "react";
import { Login } from "./components/pharmacy/Login";
import { Layout } from "./components/pharmacy/Layout";
import { Dashboard } from "./components/pharmacy/Dashboard";
import { Medications } from "./components/pharmacy/Medications";
import { Sales } from "./components/pharmacy/Sales";
import { Reports } from "./components/pharmacy/Reports";
import { AdminPanel } from "./components/pharmacy/AdminPanel";
import { ErrorBoundary } from "./components/ErrorBoundary";
import authService from "./services/authService";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier la session au chargement de l'app
  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = authService.getToken();
        const user = authService.getUser();
        
        if (token && user.login && user.userId) {
          // Valider le token avec le backend
          const isValid = await authService.validateToken(token);
          
          if (isValid) {
            // Token valide, restaurer la session
            setUsername(user.login);
            setUserId(parseInt(user.userId));
            setIsLoggedIn(true);
          } else {
            // Token invalide, déconnecter
            authService.logout();
            setIsLoggedIn(false);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de la session:", error);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleLogin = (user: string, id: number) => {
    setUsername(user);
    setUserId(id);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUsername("");
    setUserId(null);
    setCurrentPage("dashboard");
  };

  // Afficher un écran de chargement pendant la vérification de la session
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de la session...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard userId={userId} />;
      case "medications":
        return <Medications />;
      case "sales":
        return (
          <ErrorBoundary>
            <Sales userId={userId} />
          </ErrorBoundary>
        );
      case "reports":
        return <Reports />;
      case "admin":
        return <AdminPanel />;
      default:
        return <Dashboard userId={userId} />;
    }
  };

  return (
    <Layout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      username={username}
      onLogout={handleLogout}
    >
      {renderPage()}
    </Layout>
  );
}
