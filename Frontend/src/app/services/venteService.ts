import authService from "./authService";

const API_BASE_URL = "http://localhost:8081/api";

export interface LigneVente {
  id: number;
  medicament: {
    id: number;
    nom: string;
    prix: number;
  };
  quantite: number;
  prixUnitaire: number;
  sousTotal?: number;
}

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
  lignes?: LigneVente[];
}

// Backend DTO structure
interface VenteBackendDTO {
  id: number;
  date: string;
  montantTotal: number;
  avecOrdonnance: boolean;
  patientId?: number;
  patientNom?: string;
  medecinId?: number;
  medecinNom?: string;
  utilisateurId?: number;
  utilisateurNom?: string;
  lignes?: Array<{
    id: number;
    medicamentId: number;
    medicamentNom: string;
    quantite: number;
    prixUnitaire: number;
  }>;
}

export interface VenteRequestDTO {
  patientId: number;
  medecinId?: number;
  utilisateurId: number;
  montantTotal: number;
  avecOrdonnance: boolean;
  lignes: Array<{
    medicamentId: number;
    quantite: number;
    prixUnitaire: number;
  }>;
}

class VenteService {
  private getHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authService.getToken()}`,
    };
  }

  async getAllVentes(): Promise<Vente[]> {
    try {
      const token = authService.getToken();
      console.log("=== getAllVentes DEBUG ===");
      console.log("Token disponible:", token ? `${token.substring(0, 20)}...` : "NON");
      console.log("URL:", `${API_BASE_URL}/ventes/all`);
      
      const headers = this.getHeaders();
      console.log("Headers:", headers);
      
      const response = await fetch(`${API_BASE_URL}/ventes/all`, {
        method: "GET",
        headers: headers,
      });

      console.log("Response status:", response.status, response.statusText);
      console.log("Response headers:", {
        contentType: response.headers.get("content-type"),
        contentLength: response.headers.get("content-length"),
      });
      
      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorText = "Unknown error";
        
        if (contentType && contentType.includes("application/json")) {
          try {
            const errorData = await response.json();
            errorText = errorData.message || errorData.error || JSON.stringify(errorData);
          } catch (e) {
            errorText = await response.text();
          }
        } else {
          errorText = await response.text();
        }
        
        console.error("Erreur API:", errorText);
        throw new Error(`Failed to fetch ventes: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const backendData: VenteBackendDTO[] = await response.json();
      console.log("Données brutes du backend:", backendData);
      console.log("Nombre de ventes reçues:", backendData.length);
      
      // Transform backend data to frontend format
      const transformedData: Vente[] = backendData.map(v => ({
        id: v.id,
        date: v.date,
        montantTotal: v.montantTotal,
        avecOrdonnance: v.avecOrdonnance,
        patient: v.patientId ? {
          id: v.patientId,
          nom: v.patientNom || "",
        } : undefined,
        medecin: v.medecinId ? {
          id: v.medecinId,
          nom: v.medecinNom || "",
        } : undefined,
        utilisateur: v.utilisateurId ? {
          id: v.utilisateurId,
          login: v.utilisateurNom || "",
        } : undefined,
        lignes: (v.lignes || []).map(ligne => ({
          id: ligne.id,
          medicament: {
            id: ligne.medicamentId,
            nom: ligne.medicamentNom,
            prix: 0,
          },
          quantite: ligne.quantite,
          prixUnitaire: ligne.prixUnitaire,
        })),
      }));
      
      console.log("Ventes transformées:", transformedData);
      console.log("=== FIN getAllVentes DEBUG ===");
      return transformedData;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error("❌ ERREUR dans getAllVentes:", msg);
      console.error("Stack trace:", error);
      throw error;
    }
  }

  async getVenteById(id: number): Promise<Vente | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/ventes/by-id/${id}`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) throw new Error("Failed to fetch vente");
      return response.json();
    } catch (error) {
      console.error("Error fetching vente:", error);
      return null;
    }
  }

  async getVentesByUtilisateur(utilisateurId: number): Promise<Vente[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/ventes/by-utilisateur/${utilisateurId}`,
        {
          method: "GET",
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch ventes");
      return response.json();
    } catch (error) {
      console.error("Error fetching ventes:", error);
      return [];
    }
  }

  async getVentesByDateRange(debut: Date, fin: Date): Promise<Vente[]> {
    try {
      const debutStr = debut.toISOString();
      const finStr = fin.toISOString();
      const response = await fetch(
        `${API_BASE_URL}/ventes/by-date-range?debut=${debutStr}&fin=${finStr}`,
        {
          method: "GET",
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch ventes");
      return response.json();
    } catch (error) {
      console.error("Error fetching ventes:", error);
      return [];
    }
  }

  async getVentesByJour(jour: Date): Promise<Vente[]> {
    try {
      const jourStr = jour.toISOString();
      const response = await fetch(
        `${API_BASE_URL}/ventes/by-jour?jour=${jourStr}`,
        {
          method: "GET",
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch ventes");
      const data: VenteBackendDTO[] = await response.json();
      return this.transformVentes(data);
    } catch (error) {
      console.error("Error fetching ventes by jour:", error);
      return [];
    }
  }

  async getVentesBySemaine(annee: number, semaine: number): Promise<Vente[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/ventes/by-semaine?annee=${annee}&semaine=${semaine}`,
        {
          method: "GET",
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch ventes");
      const data: VenteBackendDTO[] = await response.json();
      return this.transformVentes(data);
    } catch (error) {
      console.error("Error fetching ventes by semaine:", error);
      return [];
    }
  }

  async getVentesByMois(annee: number, mois: number): Promise<Vente[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/ventes/by-mois?annee=${annee}&mois=${mois}`,
        {
          method: "GET",
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch ventes");
      const data: VenteBackendDTO[] = await response.json();
      return this.transformVentes(data);
    } catch (error) {
      console.error("Error fetching ventes by mois:", error);
      return [];
    }
  }

  async getVentesByTrimestre(annee: number, trimestre: number): Promise<Vente[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/ventes/by-trimestre?annee=${annee}&trimestre=${trimestre}`,
        {
          method: "GET",
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch ventes");
      const data: VenteBackendDTO[] = await response.json();
      return this.transformVentes(data);
    } catch (error) {
      console.error("Error fetching ventes by trimestre:", error);
      return [];
    }
  }

  async getVentesBySemestre(annee: number, semestre: number): Promise<Vente[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/ventes/by-semestre?annee=${annee}&semestre=${semestre}`,
        {
          method: "GET",
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch ventes");
      const data: VenteBackendDTO[] = await response.json();
      return this.transformVentes(data);
    } catch (error) {
      console.error("Error fetching ventes by semestre:", error);
      return [];
    }
  }

  async getVentesByAnnee(annee: number): Promise<Vente[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/ventes/by-annee?annee=${annee}`,
        {
          method: "GET",
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch ventes");
      const data: VenteBackendDTO[] = await response.json();
      return this.transformVentes(data);
    } catch (error) {
      console.error("Error fetching ventes by annee:", error);
      return [];
    }
  }

  private transformVentes(backendData: VenteBackendDTO[]): Vente[] {
    return backendData.map(v => ({
      id: v.id,
      date: v.date,
      montantTotal: v.montantTotal,
      avecOrdonnance: v.avecOrdonnance,
      patient: v.patientId ? {
        id: v.patientId,
        nom: v.patientNom || "",
      } : undefined,
      medecin: v.medecinId ? {
        id: v.medecinId,
        nom: v.medecinNom || "",
      } : undefined,
      utilisateur: v.utilisateurId ? {
        id: v.utilisateurId,
        login: v.utilisateurNom || "",
      } : undefined,
      lignes: (v.lignes || []).map(ligne => ({
        id: ligne.id,
        medicament: {
          id: ligne.medicamentId,
          nom: ligne.medicamentNom,
          prix: 0,
        },
        quantite: ligne.quantite,
        prixUnitaire: ligne.prixUnitaire,
      })),
    }));
  }

  async createVente(data: VenteRequestDTO): Promise<Vente | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/ventes/create`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create vente");
      return response.json();
    } catch (error) {
      console.error("Error creating vente:", error);
      return null;
    }
  }

  async updateVente(id: number, data: VenteRequestDTO): Promise<Vente | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/ventes/update/${id}`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update vente");
      return response.json();
    } catch (error) {
      console.error("Error updating vente:", error);
      return null;
    }
  }

  async deleteVente(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/ventes/delete/${id}`, {
        method: "DELETE",
        headers: this.getHeaders(),
      });

      return response.ok;
    } catch (error) {
      console.error("Error deleting vente:", error);
      return false;
    }
  }

  async getRecentVentes(limit: number = 10): Promise<Vente[]> {
    try {
      const ventes = await this.getAllVentes();
      return ventes
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error("Error fetching recent ventes:", error);
      return [];
    }
  }

  async getVentesToday(): Promise<Vente[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.getVentesByDateRange(today, tomorrow);
  }

  async getVentesYesterday(): Promise<Vente[]> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const today = new Date(yesterday);
    today.setDate(today.getDate() + 1);

    return this.getVentesByDateRange(yesterday, today);
  }

  async getTotalRevenue(): Promise<number> {
    const ventes = await this.getAllVentes();
    return ventes.reduce((sum, vente) => sum + vente.montantTotal, 0);
  }

  async getTotalRevenueToday(): Promise<number> {
    const ventes = await this.getVentesToday();
    return ventes.reduce((sum, vente) => sum + vente.montantTotal, 0);
  }

  /**
   * Récupérer les ventes contenant un médicament spécifique
   */
  async getVentesByMedicament(medicamentId: number): Promise<Vente[]> {
    try {
      const ventes = await this.getAllVentes();
      // Filtrer les ventes qui contiennent ce médicament
      return ventes.filter((vente) =>
        vente.lignes?.some((ligne) => ligne.medicament.id === medicamentId)
      );
    } catch (error) {
      console.error("Error fetching ventes by medicament:", error);
      return [];
    }
  }
}

export default new VenteService();
