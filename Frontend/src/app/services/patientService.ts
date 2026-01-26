import authService from "./authService";

const API_BASE_URL = "http://localhost:8081/api";

export interface Patient {
  id: number;
  nom: string;
  age: number;
  contact: string;
}

export interface PatientRequestDTO {
  nom: string;
  age: number;
  contact: string;
}

class PatientService {
  private getHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authService.getToken()}`,
    };
  }

  async getAllPatients(): Promise<Patient[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/all`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) throw new Error("Failed to fetch patients");
      return response.json();
    } catch (error) {
      console.error("Error fetching patients:", error);
      return [];
    }
  }

  async getPatientById(id: number): Promise<Patient | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/by-id/${id}`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) throw new Error("Failed to fetch patient");
      return response.json();
    } catch (error) {
      console.error("Error fetching patient:", error);
      return null;
    }
  }

  async createPatient(data: PatientRequestDTO): Promise<Patient | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/create`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create patient");
      return response.json();
    } catch (error) {
      console.error("Error creating patient:", error);
      return null;
    }
  }

  async updatePatient(id: number, data: PatientRequestDTO): Promise<Patient | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/update/${id}`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update patient");
      return response.json();
    } catch (error) {
      console.error("Error updating patient:", error);
      return null;
    }
  }

  async deletePatient(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/delete/${id}`, {
        method: "DELETE",
        headers: this.getHeaders(),
      });

      return response.ok;
    } catch (error) {
      console.error("Error deleting patient:", error);
      return false;
    }
  }
}

export default new PatientService();
