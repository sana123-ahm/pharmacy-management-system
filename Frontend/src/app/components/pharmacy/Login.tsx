import { useState } from "react";
import { Eye, EyeOff, Lock, User, Pill, Loader } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import authService from "../../services/authService";

interface LoginProps {
  onLogin: (username: string, userId: number) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!username.trim() || !password) {
        setError("Veuillez remplir tous les champs");
        return;
      }

      const response = await authService.login(username, password);
      
      // Stocker le token et les infos utilisateur
      authService.setToken(response.token);
      authService.setUser(response.userId, response.login);
      
      onLogin(response.login, response.userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion. Vérifiez vos identifiants.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!username.trim() || !password) {
        setError("Veuillez remplir tous les champs");
        return;
      }

      if (password.length < 6) {
        setError("Le mot de passe doit contenir au moins 6 caractères");
        return;
      }

      const response = await authService.register(username, password);
      
      // Stocker le token et les infos utilisateur
      authService.setToken(response.token);
      authService.setUser(response.userId, response.login);
      
      onLogin(response.login, response.userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Logo et titre */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500 rounded-full mb-4">
              <Pill className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              PharmaGest
            </h1>
            <p className="text-gray-600">
              Système de gestion de pharmacie
            </p>
          </div>

          {/* Onglets */}
          <div className="flex gap-2 mb-6">
            <Button
              type="button"
              onClick={() => setIsRegistering(false)}
              className={`flex-1 h-10 ${
                !isRegistering
                  ? "bg-teal-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Connexion
            </Button>
            <Button
              type="button"
              onClick={() => setIsRegistering(true)}
              className={`flex-1 h-10 ${
                isRegistering
                  ? "bg-teal-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Inscription
            </Button>
          </div>

          {/* Formulaire */}
          <form onSubmit={isRegistering ? handleRegister : handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Entrez votre identifiant"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 h-12"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50"
            >
              {isLoading ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : isRegistering ? (
                "S'inscrire"
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>

          {/* Info texte */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
            <p className="font-semibold mb-2">ℹ️ Informations :</p>
            <p>Utilisez vos identifiants pour vous connecter à la plateforme.</p>
            <p className="mt-2">Si vous n'avez pas de compte, cliquez sur "Inscription".</p>
          </div>
        </div>
      </div>
    </div>
  );
}