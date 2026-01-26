import authService from "./authService";

const API_BASE_URL = "http://localhost:8081/api";

export interface Vente {
  id: number;
  date: string;
  montantTotal: number;
  avecOrdonnance: boolean;
  patient?: {
    id: number;
    nom: string;
  };
  medecin?: {
    id: number;
    nom: string;
  };
  utilisateur?: {
    id: number;
    login: string;
  };
}

class FactureService {
  private getHeaders() {
    return {
      Authorization: `Bearer ${authService.getToken()}`,
    };
  }

  async telechargerFacture(venteId: number, fileName?: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/ventes/facture/${venteId}`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: Impossible de générer la facture`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || `facture_${venteId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log("✓ Facture téléchargée avec succès");
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error("❌ Erreur téléchargement facture:", msg);
      throw error;
    }
  }
}

export default new FactureService();
