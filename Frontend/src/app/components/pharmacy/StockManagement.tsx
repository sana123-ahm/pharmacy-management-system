import { useEffect, useState } from "react";
import {
  Package,
  Plus,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  History,
  Search,
  Loader,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import stockService, { type StockMovement, type MedicamentStock } from "../../services/stockService";
import venteService from "../../services/venteService";
import { Alert, AlertDescription } from "../ui/alert";

// Type combiné pour l'historique (mouvements + ventes)
interface HistoryItem {
  id: string; // "movement-{id}" ou "vente-{id}"
  type: "RECEPTION" | "AJUSTEMENT" | "VENTE";
  quantite: number;
  motif?: string;
  createdAt: string;
  prixUnitaire?: number;
  montantTotal?: number;
}

export function StockManagement() {
  const [medicaments, setMedicaments] = useState<MedicamentStock[]>([]);
  const [lowStockMedicaments, setLowStockMedicaments] = useState<MedicamentStock[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [allMovements, setAllMovements] = useState<any[]>([]); // Pour le total des mouvements
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedicament, setSelectedMedicament] = useState<MedicamentStock | null>(null);
  const [showAddMovement, setShowAddMovement] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAllMeds, setShowAllMeds] = useState(false);
  const [showAllMovements, setShowAllMovements] = useState(false);
  const [formData, setFormData] = useState({
    quantite: "",
    type: "RECEPTION" as const,
    motif: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "RECEPTION" | "AJUSTEMENT" | "VENTE">("ALL");

  // Charger les données au démarrage
  useEffect(() => {
    loadMedicaments();
  }, []);

  const loadMedicaments = async () => {
    setLoading(true);
    try {
      const data = await stockService.getMedicamentsWithStock();
      setMedicaments(data);

      // Identifier les stocks bas (< 10)
      const lowStock = data.filter((med) => med.stock <= 10);
      setLowStockMedicaments(lowStock);
      
      // Charger TOUS les mouvements pour le total
      const allMovs = await stockService.getAllMovements();
      setAllMovements(allMovs);
    } catch (err) {
      setError("Erreur lors du chargement des médicaments");
    } finally {
      setLoading(false);
    }
  };

  const loadMovementsForMedicament = async (medicament: MedicamentStock) => {
    try {
      // Charger les mouvements de stock
      const stockMovements = await stockService.getMovementsByMedicament(medicament.id);
      
      // Charger les ventes contenant ce médicament
      const ventes = await venteService.getVentesByMedicament(medicament.id);
      
      // Combiner les mouvements et ventes en un historique unique
      const combinedHistory: HistoryItem[] = [
        // Ajouter les mouvements de stock
        ...stockMovements.map((mov) => ({
          id: `movement-${mov.id}`,
          type: mov.type as "RECEPTION" | "AJUSTEMENT",
          quantite: mov.quantite,
          motif: mov.motif,
          createdAt: mov.createdAt,
        })),
        // Ajouter les ventes
        ...ventes.flatMap((vente) =>
          (vente.lignes || [])
            .filter((ligne) => ligne.medicament.id === medicament.id)
            .map((ligne) => ({
              id: `vente-${vente.id}-${ligne.id}`,
              type: "VENTE" as const,
              quantite: ligne.quantite,
              motif: `Vente - Patient: ${vente.patient?.nom || "Inconnu"}`,
              createdAt: vente.date,
              prixUnitaire: ligne.prixUnitaire,
              montantTotal: ligne.quantite * ligne.prixUnitaire,
            }))
        ),
      ];
      
      // Trier par date décroissante
      combinedHistory.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setMovements(combinedHistory as any);
      setSelectedMedicament(medicament);
      setShowHistory(true);
    } catch (err) {
      setError("Erreur lors du chargement de l'historique");
    }
  };

  const handleAddMovement = async () => {
    if (!selectedMedicament || !formData.quantite) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    try {
      setError("");
      setSuccess("");
      
      await stockService.createMovement(
        selectedMedicament.id,
        parseInt(formData.quantite),
        formData.type,
        formData.motif
      );

      setSuccess(`Mouvement de stock enregistré avec succès!`);
      setFormData({ quantite: "", type: "RECEPTION", motif: "" });
      setShowAddMovement(false);
      
      // Recharger les données
      await loadMedicaments();
      
      // Recharger l'historique si visible
      if (showHistory && selectedMedicament) {
        await loadMovementsForMedicament(selectedMedicament);
      }

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'ajout du mouvement");
    }
  };

  const getStockColor = (stock: number) => {
    if (stock <= 5) return "text-red-600";
    if (stock <= 10) return "text-yellow-600";
    return "text-green-600";
  };

  const getMovementColor = (type: string) => {
    switch (type) {
      case "RECEPTION":
        return "bg-green-100 text-green-800";
      case "VENTE":
        return "bg-blue-100 text-blue-800";
      case "AJUSTEMENT":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case "RECEPTION":
        return <TrendingUp className="w-4 h-4" />;
      case "VENTE":
        return <TrendingDown className="w-4 h-4" />;
      case "AJUSTEMENT":
        return <Package className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const filteredMedicaments = medicaments.filter((med) =>
    med.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMovements = movements.filter((mov) =>
    filterType === "ALL" ? true : mov.type === filterType
  );

  return (
    <div className="p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Stocks</h1>
            </div>
            <Button
              onClick={() => setShowAddMovement(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un Mouvement
            </Button>
          </div>
          <p className="text-gray-600 mt-2">Gérez les stocks et les mouvements de médicaments</p>
        </div>

        {/* Alertes */}
        {error && (
          <Alert className="mb-6 border-red-300 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-300 bg-green-50">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Section Stock Bas */}
        {lowStockMedicaments.length > 0 && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <h2 className="text-lg font-semibold text-yellow-800">
                ⚠️ Alertes d'Approvisionnement ({lowStockMedicaments.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {lowStockMedicaments.map((med) => (
                <div
                  key={med.id}
                  className="bg-white p-3 rounded border-l-4 border-yellow-400"
                >
                  <p className="font-semibold text-sm">{med.nom}</p>
                  <p className={`text-sm font-bold ${getStockColor(med.stock)}`}>
                    Stock: {med.stock} unités
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-2 text-xs"
                    onClick={() => {
                      setSelectedMedicament(med);
                      setShowAddMovement(true);
                      setFormData({ ...formData, type: "RECEPTION" });
                    }}
                  >
                    Ajouter Stock
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Total Médicaments</p>
            <p className="text-3xl font-bold text-blue-600">{medicaments.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Stock Bas (&lt;= 10)</p>
            <p className="text-3xl font-bold text-yellow-600">{lowStockMedicaments.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Stock Critique (&lt;= 5)</p>
            <p className="text-3xl font-bold text-red-600">
              {medicaments.filter((m) => m.stock <= 5).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Total Mouvements</p>
            <p className="text-3xl font-bold text-purple-600">{allMovements.length}</p>
          </div>
        </div>

        {/* Recherche */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Chercher un médicament..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tableau des Stocks */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Nom du Médicament
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Prix
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Stock Actuel
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Fournisseur
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <Loader className="w-6 h-6 animate-spin mx-auto text-blue-600" />
                    </td>
                  </tr>
                ) : filteredMedicaments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Aucun médicament trouvé
                    </td>
                  </tr>
                ) : (
                  (showAllMeds ? filteredMedicaments : filteredMedicaments.slice(0, 15)).map((med) => (
                    <tr key={med.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {med.nom}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        ${med.prix.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`font-bold ${getStockColor(med.stock)}`}>
                          {med.stock} unités
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            med.stock <= 5
                              ? "bg-red-100 text-red-800"
                              : med.stock <= 10
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {med.stock <= 5 ? "Critique" : med.stock <= 10 ? "Bas" : "Normal"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {med.fournisseur?.nom || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedMedicament(med);
                            setShowAddMovement(true);
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => loadMovementsForMedicament(med)}
                        >
                          <History className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filteredMedicaments.length > 15 && (
            <div className="px-6 py-4 border-t border-gray-200 flex justify-center bg-gray-50">
              <button
                onClick={() => setShowAllMeds(!showAllMeds)}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                {showAllMeds ? (
                  <>
                    <span>Voir moins</span>
                    <svg className="h-5 w-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </>
                ) : (
                  <>
                    <span>Voir plus ({filteredMedicaments.length - 15} de plus)</span>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Dialog Ajouter Mouvement */}
        <Dialog open={showAddMovement} onOpenChange={setShowAddMovement}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Ajouter un Mouvement de Stock</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {!selectedMedicament && (
                <div>
                  <Label>Sélectionner un Médicament *</Label>
                  <select
                    value={selectedMedicament?.id || ""}
                    onChange={(e) => {
                      const med = medicaments.find((m) => m.id === parseInt(e.target.value));
                      setSelectedMedicament(med || null);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Choisir un médicament...</option>
                    {medicaments.map((med) => (
                      <option key={med.id} value={med.id}>
                        {med.nom} (Stock: {med.stock})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedMedicament && (
                <>
                  <div className="bg-blue-50 p-3 rounded border border-blue-200">
                    <p className="text-sm text-gray-600">Médicament sélectionné</p>
                    <p className="font-semibold text-lg">{selectedMedicament.nom}</p>
                    <p className="text-sm text-gray-600">
                      Stock actuel: <span className={`font-bold ${getStockColor(selectedMedicament.stock)}`}>{selectedMedicament.stock} unités</span>
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 w-full text-xs"
                      onClick={() => setSelectedMedicament(null)}
                    >
                      Changer de médicament
                    </Button>
                  </div>

                  <div>
                    <Label>Type de Mouvement *</Label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          type: e.target.value as "RECEPTION" | "AJUSTEMENT",
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="RECEPTION">📥 Réception (Ajouter du stock)</option>
                      <option value="AJUSTEMENT">🔧 Ajustement (Corriger la quantité)</option>
                    </select>
                  </div>

                  <div>
                    <Label>
                      {formData.type === "RECEPTION" ? "Quantité à ajouter" : "Nouvelle quantité totale"} *
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.quantite}
                      onChange={(e) => setFormData({ ...formData, quantite: e.target.value })}
                      placeholder={formData.type === "RECEPTION" ? "Entrer la quantité à ajouter" : "Entrer la nouvelle quantité totale"}
                    />
                    {formData.type === "AJUSTEMENT" && (
                      <p className="text-xs text-gray-500 mt-1">
                        ℹ️ Vous définissez la quantité TOTALE exacte du stock
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Motif (Optionnel)</Label>
                    <Input
                      type="text"
                      value={formData.motif}
                      onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
                      placeholder="Ex: Réception fournisseur, correction d'inventaire..."
                    />
                  </div>

                  {error && (
                    <Alert className="border-red-300 bg-red-50">
                      <AlertDescription className="text-red-800">{error}</AlertDescription>
                    </Alert>
                  )}
                </>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowAddMovement(false);
                setSelectedMedicament(null);
                setFormData({ quantite: "", type: "RECEPTION", motif: "" });
              }}>
                Annuler
              </Button>
              <Button 
                onClick={handleAddMovement} 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!selectedMedicament || !formData.quantite}
              >
                Ajouter le Mouvement
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Historique */}
        <Dialog open={showHistory} onOpenChange={setShowHistory}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                Historique des Mouvements - {selectedMedicament?.nom}
              </DialogTitle>
            </DialogHeader>

            <div className="mb-4">
              <div className="flex gap-2">
                {["ALL", "RECEPTION", "AJUSTEMENT", "VENTE"].map((type) => (
                  <Button
                    key={type}
                    size="sm"
                    variant={filterType === type ? "default" : "outline"}
                    onClick={() => setFilterType(type as any)}
                  >
                    {type === "ALL" ? "Tous" : type}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredMovements.length === 0 ? (
                <p className="text-center text-gray-500 py-6">
                  Aucun mouvement trouvé
                </p>
              ) : (
                (showAllMovements ? filteredMovements : filteredMovements.slice(0, 15)).map((mov) => (
                  <div
                    key={mov.id}
                    className={`p-3 rounded border-l-4 flex items-center justify-between ${getMovementColor(mov.type)}`}
                  >
                    <div className="flex items-center gap-3">
                      {getMovementIcon(mov.type)}
                      <div>
                        <p className="font-semibold text-sm">{mov.type}</p>
                        <p className="text-xs">{mov.motif || "Sans motif"}</p>
                        <p className="text-xs opacity-75">
                          {new Date(mov.createdAt).toLocaleString("fr-FR")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        {mov.type === "VENTE" ? "-" : "+"}{mov.quantite}
                      </p>
                      {mov.montantTotal !== undefined && (
                        <p className="text-xs text-gray-600">
                          {mov.montantTotal.toFixed(2)} DH
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            {filteredMovements.length > 15 && (
              <div className="mt-4 pt-4 border-t flex justify-center">
                <button
                  onClick={() => setShowAllMovements(!showAllMovements)}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  {showAllMovements ? (
                    <>
                      <span>Voir moins</span>
                      <svg className="h-5 w-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </>
                  ) : (
                    <>
                      <span>Voir plus ({filteredMovements.length - 15} de plus)</span>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
