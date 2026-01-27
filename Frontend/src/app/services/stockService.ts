import authService from "./authService";

const API_BASE_URL = "http://localhost:8081/api";

export interface StockMovement {
  id: number;
  medicamentId: number;
  medicamentNom: string;
  quantite: number;
  type: "RECEPTION" | "AJUSTEMENT";
  motif: string;
  createdAt: string;
}

export interface MedicamentStock {
  id: number;
  nom: string;
  prix: number;
  stock: number;
  ordonnanceRequise: boolean;
  fournisseur?: {
    id: number;
    nom: string;
  };
}

class StockService {
  private getHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authService.getToken()}`,
    };
  }

  // ===== MOUVEMENTS DE STOCK =====

  /**
   * Créer un mouvement de stock (réception, vente, ajustement)
   */
  async createMovement(
    medicamentId: number,
    quantite: number,
    type: "RECEPTION" | "AJUSTEMENT",
    motif: string = ""
  ): Promise<StockMovement> {
    try {
      const response = await fetch(`${API_BASE_URL}/stock-movements/create`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({
          medicamentId,
          quantite,
          type,
          motif,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || "Erreur lors de la création du mouvement");
      }
      return response.json();
    } catch (error) {
      console.error("Error creating stock movement:", error);
      throw error;
    }
  }

  /**
   * Récupérer tous les mouvements d'un médicament
   */
  async getMovementsByMedicament(medicamentId: number): Promise<StockMovement[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/stock-movements/medicament/${medicamentId}`,
        {
          method: "GET",
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        console.warn(`Erreur ${response.status} lors du chargement des mouvements`);
        return [];
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching movements:", error);
      return [];
    }
  }

  /**
   * Récupérer les mouvements d'une période
   */
  async getMovementsByPeriod(
    startDate: string,
    endDate: string
  ): Promise<StockMovement[]> {
    try {
      const startDateTime = `${startDate}T00:00:00`;
      const endDateTime = `${endDate}T23:59:59`;

      const response = await fetch(
        `${API_BASE_URL}/stock-movements/period?start=${encodeURIComponent(
          startDateTime
        )}&end=${encodeURIComponent(endDateTime)}`,
        {
          method: "GET",
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) throw new Error("Erreur lors du chargement des mouvements");
      return response.json();
    } catch (error) {
      console.error("Error fetching movements by period:", error);
      return [];
    }
  }

  /**
   * Récupérer les mouvements d'un médicament sur une période
   */
  async getMovementsByMedicamentAndPeriod(
    medicamentId: number,
    startDate: string,
    endDate: string
  ): Promise<StockMovement[]> {
    try {
      const startDateTime = `${startDate}T00:00:00`;
      const endDateTime = `${endDate}T23:59:59`;

      const response = await fetch(
        `${API_BASE_URL}/stock-movements/medicament/${medicamentId}/period?start=${encodeURIComponent(
          startDateTime
        )}&end=${encodeURIComponent(endDateTime)}`,
        {
          method: "GET",
          headers: this.getHeaders(),
        }
      );

      if (!response.ok)
        throw new Error(
          "Erreur lors du chargement des mouvements du médicament"
        );
      return response.json();
    } catch (error) {
      console.error("Error fetching medicament movements by period:", error);
      return [];
    }
  }

  /**
   * Récupérer tous les mouvements
   */
  async getAllMovements(): Promise<StockMovement[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/stock-movements/all`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) throw new Error("Erreur lors du chargement des mouvements");
      return response.json();
    } catch (error) {
      console.error("Error fetching all movements:", error);
      return [];
    }
  }

  /**
   * Supprimer un mouvement (seulement les ajustements)
   */
  async deleteMovement(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/stock-movements/${id}`, {
        method: "DELETE",
        headers: this.getHeaders(),
      });

      return response.ok;
    } catch (error) {
      console.error("Error deleting movement:", error);
      return false;
    }
  }

  // ===== STOCKS MÉDICAMENTS =====

  /**
   * Récupérer tous les médicaments avec leur stock
   */
  async getMedicamentsWithStock(): Promise<MedicamentStock[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/medicaments/all`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) throw new Error("Erreur lors du chargement des médicaments");
      return response.json();
    } catch (error) {
      console.error("Error fetching medicaments:", error);
      return [];
    }
  }

  /**
   * Récupérer les médicaments avec stock bas
   */
  async getLowStockMedicaments(threshold: number = 10): Promise<MedicamentStock[]> {
    try {
      const medicaments = await this.getMedicamentsWithStock();
      return medicaments.filter((med) => med.stock <= threshold);
    } catch (error) {
      console.error("Error fetching low stock medicaments:", error);
      return [];
    }
  }
}

export default new StockService();
