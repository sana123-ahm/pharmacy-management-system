import authService from "./authService";

const API_BASE_URL = "http://localhost:8081/api";

export interface Medicament {
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

export interface MedicamentRequestDTO {
  nom: string;
  prix: number;
  stock: number;
  ordonnanceRequise: boolean;
  fournisseurId?: number;
}

class MedicamentService {
  private getHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authService.getToken()}`,
    };
  }

  async getAllMedicaments(): Promise<Medicament[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/medicaments/all`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) throw new Error("Failed to fetch medicaments");
      return response.json();
    } catch (error) {
      console.error("Error fetching medicaments:", error);
      return [];
    }
  }

  async getMedicamentById(id: number): Promise<Medicament | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/medicaments/by-id/${id}`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) throw new Error("Failed to fetch medicament");
      return response.json();
    } catch (error) {
      console.error("Error fetching medicament:", error);
      return null;
    }
  }

  async createMedicament(data: MedicamentRequestDTO): Promise<Medicament | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/medicaments/create`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create medicament");
      return response.json();
    } catch (error) {
      console.error("Error creating medicament:", error);
      return null;
    }
  }

  async updateMedicament(id: number, data: MedicamentRequestDTO): Promise<Medicament | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/medicaments/update/${id}`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update medicament");
      return response.json();
    } catch (error) {
      console.error("Error updating medicament:", error);
      return null;
    }
  }

  async deleteMedicament(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/medicaments/delete/${id}`, {
        method: "DELETE",
        headers: this.getHeaders(),
      });

      return response.ok;
    } catch (error) {
      console.error("Error deleting medicament:", error);
      return false;
    }
  }

  async getLowStockMedicaments(minStock: number = 50): Promise<Medicament[]> {
    try {
      const allMedicaments = await this.getAllMedicaments();
      return allMedicaments.filter((m) => m.stock < minStock);
    } catch (error) {
      console.error("Error fetching low stock medicaments:", error);
      return [];
    }
  }
}

export default new MedicamentService();
