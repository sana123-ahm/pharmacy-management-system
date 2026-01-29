import { useEffect, useState } from "react";
import { Search, Plus, Pill, Package, Edit, Trash, Loader, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Label } from "../ui/label";
import medicamentService, { type Medicament, type MedicamentRequestDTO } from "../../services/medicamentService";

interface Fournisseur {
  id: number;
  nom: string;
}

export function Medications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medicament | null>(null);
  const [medications, setMedications] = useState<Medicament[]>([]);
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showAllMeds, setShowAllMeds] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState("");
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [medicamentToDelete, setMedicamentToDelete] = useState<Medicament | null>(null);

  const [formData, setFormData] = useState<MedicamentRequestDTO>({
    nom: "",
    prix: 0,
    stock: 0,
    ordonnanceRequise: false,
    fournisseurId: undefined,
  });

  // Charger les médicaments au montage
  useEffect(() => {
    const loadMedications = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await medicamentService.getAllMedicaments();
        setMedications(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement des médicaments");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const loadFournisseurs = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/fournisseurs/all");
        if (response.ok) {
          const data = await response.json();
          setFournisseurs(data);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des fournisseurs:", err);
      }
    };

    loadMedications();
    loadFournisseurs();
  }, []);

  const filteredMedications = medications.filter((med) =>
    med.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (medication?: Medicament) => {
    if (medication) {
      setEditingMedication(medication);
      setFormData({
        nom: medication.nom,
        prix: medication.prix,
        stock: medication.stock,
        ordonnanceRequise: medication.ordonnanceRequise,
        fournisseurId: medication.fournisseur?.id,
      });
    } else {
      setEditingMedication(null);
      setFormData({
        nom: "",
        prix: 0,
        stock: 0,
        ordonnanceRequise: false,
        fournisseurId: undefined,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      if (!formData.nom.trim()) {
        setError("Le nom du médicament est requis");
        return;
      }

      if (editingMedication) {
        const updated = await medicamentService.updateMedicament(
          editingMedication.id,
          formData
        );
        if (updated) {
          setMedications(
            medications.map((med) =>
              med.id === editingMedication.id ? updated : med
            )
          );
          setIsDialogOpen(false);
        } else {
          setError("Erreur lors de la mise à jour du médicament");
        }
      } else {
        const created = await medicamentService.createMedicament(formData);
        if (created) {
          setMedications([...medications, created]);
          setIsDialogOpen(false);
        } else {
          setError("Erreur lors de la création du médicament");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'enregistrement");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const med = medications.find((m) => m.id === id);
    if (med) {
      setMedicamentToDelete(med);
      setConfirmDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!medicamentToDelete) return;

    try {
      const success = await medicamentService.deleteMedicament(medicamentToDelete.id);
      if (success) {
        setMedications(medications.filter((med) => med.id !== medicamentToDelete.id));
        setDeleteSuccessMessage("Médicament supprimé avec succès!");
        setSuccessDialogOpen(true);
        setConfirmDeleteDialogOpen(false);
        setMedicamentToDelete(null);
      } else {
        setError("Erreur lors de la suppression du médicament");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteDialogOpen(false);
    setMedicamentToDelete(null);
  };

  const handleCloseSuccessDialog = () => {
    setSuccessDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="h-10 w-10 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestion des médicaments</h1>
          <p className="text-gray-600">{medications.length} médicaments au total</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-teal-500 hover:bg-teal-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un médicament
        </Button>
      </div>

      {/* Afficher les erreurs */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Rechercher par nom..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12"
        />
      </div>

      {/* Liste des médicaments */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        {filteredMedications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {medications.length === 0 ? "Aucun médicament disponible" : "Aucun résultat de recherche"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Médicament
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Prix
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Ordonnance
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(showAllMeds ? filteredMedications : filteredMedications.slice(0, 15)).map((medication) => (
                  <tr key={medication.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-teal-50 rounded-lg">
                          <Pill className="h-5 w-5 text-teal-600" />
                        </div>
                        <div>
                          <span className="font-semibold text-gray-800">{medication.nom}</span>
                          {medication.fournisseur && (
                            <p className="text-sm text-gray-500">{medication.fournisseur.nom}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {medication.prix.toFixed(2)} DH
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 ${
                        medication.stock < 50 ? 'text-orange-600 font-semibold' : 'text-gray-800'
                      }`}>
                        <Package className="h-4 w-4" />
                        {medication.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {medication.ordonnanceRequise ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Requise
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Non requise
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(medication)}
                          className="hover:bg-blue-50 text-blue-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(medication.id)}
                          className="hover:bg-red-50 text-red-600"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredMedications.length > 15 && (
              <div className="px-6 py-4 border-t border-gray-200 flex justify-center bg-gray-50">
                <button
                  onClick={() => setShowAllMeds(!showAllMeds)}
                  className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold transition-colors text-sm"
                >
                  {showAllMeds ? (
                    <>
                      <span>Voir moins</span>
                      <svg className="h-4 w-4 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </>
                  ) : (
                    <>
                      <span>Voir plus ({filteredMedications.length - 15})</span>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dialog d'ajout/édition */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingMedication ? "Modifier le médicament" : "Ajouter un médicament"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom du médicament *</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                placeholder="Ex: Doliprane 1000mg"
                required
                disabled={isSaving}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prix">Prix (DH) *</Label>
                <Input
                  id="prix"
                  type="number"
                  step="0.01"
                  value={formData.prix}
                  onChange={(e) => setFormData({ ...formData, prix: parseFloat(e.target.value) })}
                  placeholder="Ex: 6.25"
                  required
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  placeholder="Ex: 250"
                  required
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fournisseur">Fournisseur</Label>
              <select
                id="fournisseur"
                value={formData.fournisseurId || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  fournisseurId: e.target.value ? parseInt(e.target.value) : undefined 
                })}
                disabled={isSaving}
                className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              >
                <option value="">-- Sélectionner un fournisseur --</option>
                {fournisseurs.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.nom}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ordonnance">
                <input
                  id="ordonnance"
                  type="checkbox"
                  checked={formData.ordonnanceRequise}
                  onChange={(e) => setFormData({ ...formData, ordonnanceRequise: e.target.checked })}
                  disabled={isSaving}
                  className="mr-2"
                />
                Ordonnance requise
              </Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
                Annuler
              </Button>
              <Button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white" disabled={isSaving}>
                {isSaving ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
                {editingMedication ? "Mettre à jour" : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={confirmDeleteDialogOpen} onOpenChange={setConfirmDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold text-red-600">
              ⚠️ Confirmation de suppression
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 0v2m0-6v-2m0 0v-2m0 6v2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-700 font-medium mb-2">
              Êtes-vous sûr de vouloir supprimer ce médicament ?
            </p>
            <p className="text-gray-600 text-sm mb-6">
              <strong>{medicamentToDelete?.nom}</strong>
            </p>
            <p className="text-gray-500 text-xs mb-4">
              Cette action ne peut pas être annulée.
            </p>
          </div>
          <DialogFooter className="flex gap-3">
            <Button
              onClick={handleCancelDelete}
              variant="outline"
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={handleConfirmDelete}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de succès pour la suppression */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-green-600">
              ✓ Médicament supprimé!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-gray-700 font-medium mb-6">
              {deleteSuccessMessage}
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={handleCloseSuccessDialog}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold h-11"
            >
              OK - Continuer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
