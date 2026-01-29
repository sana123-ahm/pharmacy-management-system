import { useEffect, useState } from "react";
import { ShoppingCart, AlertCircle, Loader, Search, Plus, Trash2, Download } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { SearchableSelect } from "../ui/SearchableSelect";
import { Snackbar, Alert } from "@mui/material";
import medicamentService, { type Medicament } from "../../services/medicamentService";
import venteService, { type Vente } from "../../services/venteService";
import factureService from "../../services/factureService";

interface CartItem extends Medicament {
  quantite: number;
}

interface Patient {
  id: number;
  name: string;
}

interface Medecin {
  id: number;
  name: string;
}

interface SalesProps {
  userId?: number | null;
}

export function Sales({ userId }: SalesProps) {
  // Gestion des notifications
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmSaleDialogOpen, setConfirmSaleDialogOpen] = useState(false);
  const [insufficientStockDialogOpen, setInsufficientStockDialogOpen] = useState(false);
  const [insufficientStockItems, setInsufficientStockItems] = useState<Array<{ nom: string; stock: number; demande: number }>>([]);

  // Gestion ventes historique
  const [ventes, setVentes] = useState<Vente[]>([]);
  const [loadingVentes, setLoadingVentes] = useState(true);
  const [errorVentes, setErrorVentes] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [showAllVentes, setShowAllVentes] = useState(false);

  // Gestion des médicaments et recherche
  const [medicaments, setMedicaments] = useState<Medicament[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingMedicaments, setLoadingMedicaments] = useState(false);

  // Gestion des patients et médecins
  const [patients, setPatients] = useState<Patient[]>([]);
  const [medecins, setMedecins] = useState<Medecin[]>([]);
  const [loadingPatientsMedecins, setLoadingPatientsMedecins] = useState(false);

  // Gestion du panier
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [selectedMedecinId, setSelectedMedecinId] = useState<number | null>(null);
  const [isPrescription, setIsPrescription] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Charger les ventes au montage
  useEffect(() => {
    loadVentes();
  }, [filterPeriod]);

  // Charger les médicaments au montage
  useEffect(() => {
    loadMedicaments();
    loadPatientsMedecins();
  }, []);

  const loadVentes = async () => {
    setLoadingVentes(true);
    setErrorVentes("");
    try {
      let data: Vente[] = [];
      if (filterPeriod === "today") {
        data = await venteService.getVentesToday();
      } else if (filterPeriod === "yesterday") {
        data = await venteService.getVentesYesterday();
      } else {
        data = await venteService.getAllVentes();
      }
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setVentes(data);
    } catch (err) {
      setErrorVentes(err instanceof Error ? err.message : "Erreur lors du chargement des ventes");
    } finally {
      setLoadingVentes(false);
    }
  };

  const loadMedicaments = async () => {
    setLoadingMedicaments(true);
    try {
      const data = await medicamentService.getAllMedicaments();
      setMedicaments(data);
    } catch (err) {
      console.error("Erreur lors du chargement des médicaments:", err);
    } finally {
      setLoadingMedicaments(false);
    }
  };

  const loadPatientsMedecins = async () => {
    setLoadingPatientsMedecins(true);
    try {
      const [patientsRes, medecinsRes] = await Promise.all([
        fetch("http://localhost:8081/api/patients/all"),
        fetch("http://localhost:8081/api/medecins/all"),
      ]);

      if (patientsRes.ok) {
        const patientsData = await patientsRes.json();
        // Transformer les patients pour avoir un champ 'name'
        const patientsTransformed = patientsData.map((p: any) => ({
          id: p.id,
          name: `${p.prenom || ''} ${p.nom || ''}`.trim(),
        }));
        setPatients(patientsTransformed);
      }
      if (medecinsRes.ok) {
        const medecinsData = await medecinsRes.json();
        // Transformer les médecins pour avoir un champ 'name'
        const medecinsTransformed = medecinsData.map((m: any) => ({
          id: m.id,
          name: `${m.prenom || ''} ${m.nom || ''}`.trim(),
        }));
        setMedecins(medecinsTransformed);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des patients/médecins:", err);
    } finally {
      setLoadingPatientsMedecins(false);
    }
  };

  const filteredMedicaments = medicaments.filter((med) =>
    med.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (med: Medicament) => {
    const existingItem = cart.find((item) => item.id === med.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === med.id ? { ...item, quantite: item.quantite + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...med, quantite: 1 }]);
    }
  };

  const removeFromCart = (medId: number) => {
    setCart(cart.filter((item) => item.id !== medId));
  };

  const handleDownloadFacture = async (venteId: number) => {
    try {
      await factureService.telechargerFacture(venteId);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur lors du téléchargement";
      alert("Erreur: " + msg);
      console.error(err);
    }
  };

  const updateQuantity = (medId: number, quantite: number) => {
    if (quantite <= 0) {
      removeFromCart(medId);
    } else {
      setCart(
        cart.map((item) =>
          item.id === medId ? { ...item, quantite } : item
        )
      );
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.prix * item.quantite, 0);
  const cartRequiresPrescription = cart.some((item) => item.ordonnanceRequise);

  const handleCompleteSale = async () => {
    if (cart.length === 0) {
      alert("Le panier est vide");
      return;
    }

    if (cartRequiresPrescription && !isPrescription) {
      alert("Ce panier contient des médicaments nécessitant une ordonnance");
      return;
    }

    if (isPrescription && (!selectedPatientId || !selectedMedecinId)) {
      alert("Veuillez sélectionner un patient et un médecin pour une vente avec ordonnance");
      return;
    }

    // Vérifier que les stocks sont suffisants
    const insufficientItems: Array<{ nom: string; stock: number; demande: number }> = [];
    for (const cartItem of cart) {
      const medicament = medicaments.find(m => m.id === cartItem.id);
      if (medicament && medicament.stock < cartItem.quantite) {
        insufficientItems.push({
          nom: medicament.nom,
          stock: medicament.stock,
          demande: cartItem.quantite
        });
      }
    }

    if (insufficientItems.length > 0) {
      setInsufficientStockItems(insufficientItems);
      setInsufficientStockDialogOpen(true);
      return;
    }

    // Ouvrir le dialog de confirmation
    setConfirmSaleDialogOpen(true);
  };

  const handleConfirmSale = async () => {
    setConfirmSaleDialogOpen(false);
    setIsSaving(true);
    try {
      // Créer la vente
      const venteData = {
        patientId: selectedPatientId,
        medecinId: selectedMedecinId,
        utilisateurId: userId || 1,
        montantTotal: cartTotal,
        avecOrdonnance: isPrescription,
        lignes: cart.map((item) => ({
          medicamentId: item.id,
          quantite: item.quantite,
          prixUnitaire: item.prix,
        })),
      };

      console.log("Envoi des données:", venteData);

      // Appel API pour créer la vente
      const response = await fetch("http://localhost:8081/api/ventes/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(venteData),
      });

      console.log("Réponse du serveur:", response.status, response.statusText);

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorText = "";
        
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorText = errorData.message || errorData.error || JSON.stringify(errorData);
        } else {
          errorText = await response.text();
        }
        
        console.error("Erreur API:", errorText);
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log("Vente créée:", result);

      // Vider le panier et réinitialiser le formulaire
      setCart([]);
      setSelectedPatientId(null);
      setSelectedMedecinId(null);
      setIsPrescription(false);
      setIsDialogOpen(false);
      setSearchTerm("");

      // Recharger les ventes
      await loadVentes();
      
      // Recharger les médicaments pour mettre à jour les stocks
      await loadMedicaments();

      // Émettre un événement custom pour notifier le Dashboard
      console.log("🚀 Sales: Émission de l'événement saleCreated");
      window.dispatchEvent(new Event("saleCreated"));

      // Afficher dialog de succès
      setSuccessDialogOpen(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue lors de l'enregistrement de la vente";
      console.error("Erreur complète:", err);
      
      // Afficher notification d'erreur
      setErrorMessage(errorMessage);
      setErrorSnackbarOpen(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelSale = () => {
    setConfirmSaleDialogOpen(false);
  };

  const handleCloseErrorSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorSnackbarOpen(false);
  };

  const handleCloseSuccessDialog = () => {
    setSuccessDialogOpen(false);
  };

  const totalRevenue = ventes.reduce((sum, v) => sum + v.montantTotal, 0);
  const totalVentes = ventes.length;
  const averageSale = totalVentes > 0 ? totalRevenue / totalVentes : 0;

  if (loadingVentes && loadingMedicaments) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="h-10 w-10 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestion des ventes</h1>
          <p className="text-gray-600">Créer une vente et consulter l'historique</p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-teal-500 hover:bg-teal-600 text-white h-12"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle vente
        </Button>
      </div>

      {/* Afficher les erreurs */}
      {errorVentes && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <p>{errorVentes}</p>
        </div>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <p className="text-gray-600 text-sm mb-1">Total des ventes</p>
          <p className="text-3xl font-bold text-teal-600">{totalVentes}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <p className="text-gray-600 text-sm mb-1">Chiffre d'affaires</p>
          <p className="text-3xl font-bold text-green-600">{totalRevenue.toFixed(2)} DH</p>
        </div>
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <p className="text-gray-600 text-sm mb-1">Ticket moyen</p>
          <p className="text-3xl font-bold text-blue-600">{averageSale.toFixed(2)} DH</p>
        </div>
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <p className="text-gray-600 text-sm mb-1">Période</p>
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="text-lg font-bold text-gray-800 border-none bg-transparent focus:outline-none"
          >
            <option value="all">Toutes</option>
            <option value="today">Aujourd'hui</option>
            <option value="yesterday">Hier</option>
          </select>
        </div>
      </div>

      {/* Historique des ventes */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Historique des ventes</h2>
        </div>
        {ventes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Aucune vente pour cette période</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Patient</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Articles</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Total</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(showAllVentes ? ventes : ventes.slice(0, 15)).map((vente) => (
                  <tr key={vente.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">
                        {new Date(vente.date).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-800">{vente.patient?.nom || "N/A"}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {vente.lignes?.length || 0} article(s)
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {vente.avecOrdonnance ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Avec ordonnance
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Sans ordonnance
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-lg font-bold text-teal-600">
                        {vente.montantTotal.toFixed(2)} DH
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button
                        size="sm"
                        onClick={() => handleDownloadFacture(vente.id)}
                        className="bg-teal-500 hover:bg-teal-600 text-white"
                        title="Télécharger la facture PDF"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {ventes.length > 15 && (
              <div className="px-6 py-4 border-t border-gray-200 flex justify-center">
                <button
                  onClick={() => setShowAllVentes(!showAllVentes)}
                  className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold transition-colors"
                >
                  {showAllVentes ? (
                    <>
                      <span>Voir moins</span>
                      <svg className="h-5 w-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </>
                  ) : (
                    <>
                      <span>Voir plus ({ventes.length - 15} de plus)</span>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Dialog de création de vente */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle vente</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-6">
            {/* Colonne gauche - Recherche et sélection des médicaments */}
            <div className="col-span-1 space-y-4">
              {/* Recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher un médicament..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>

              {/* Liste des médicaments */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 max-h-96 overflow-y-auto">
                {loadingMedicaments ? (
                  <div className="text-center text-gray-500">
                    <Loader className="h-5 w-5 animate-spin mx-auto" />
                  </div>
                ) : filteredMedicaments.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p>Aucun médicament trouvé</p>
                  </div>
                ) : (
                  filteredMedicaments.map((med) => (
                    <div
                      key={med.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-teal-500 hover:bg-teal-50 transition-all"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">{med.nom}</p>
                        <p className="text-xs text-gray-600">
                            {med.prix.toFixed(2)} DH • Stock: {med.stock}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => addToCart(med)}
                        className="bg-teal-500 hover:bg-teal-600 text-white"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Colonne droite - Panier */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800">Panier</h3>

              {cart.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500 text-sm">
                  <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>Panier vide</p>
                </div>
              ) : (
                <>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2 max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="bg-white rounded-lg p-2 text-sm">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-xs">{item.nom}</p>
                            <p className="text-xs text-gray-600">{item.prix.toFixed(2)} DH / unité</p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:bg-red-50 h-6 w-6 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantite - 1)}
                            className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs"
                          >
                            -
                          </button>
                          <span className="flex-1 text-center text-xs font-semibold">{item.quantite}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantite + 1)}
                            className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs"
                          >
                            +
                          </button>
                          <span className="ml-auto font-semibold text-teal-600 text-xs">
                            {(item.prix * item.quantite).toFixed(2)} DH
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex items-center justify-between text-lg font-bold text-gray-800 mb-3">
                      <span>Total</span>
                      <span className="text-teal-600">{cartTotal.toFixed(2)} DH</span>
                    </div>

                    {cartRequiresPrescription && (
                      <div className="mb-3 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-800">
                        ⚠️ Ordonnance requise pour ce panier
                      </div>
                    )}

                    {isPrescription && (
                      <div className="space-y-2 mb-3">
                        <SearchableSelect
                          label="Patient"
                          placeholder="Select a patient"
                          items={patients}
                          value={selectedPatientId}
                          onChange={setSelectedPatientId}
                        />
                        <SearchableSelect
                          label="Médecin"
                          placeholder="Select a doctor"
                          items={medecins}
                          value={selectedMedecinId}
                          onChange={setSelectedMedecinId}
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-3">
                      <input
                        type="checkbox"
                        id="prescription"
                        checked={isPrescription}
                        onChange={(e) => setIsPrescription(e.target.checked)}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="prescription" className="text-xs cursor-pointer">
                        Avec ordonnance
                      </Label>
                    </div>

                    <Button
                      onClick={handleCompleteSale}
                      disabled={isSaving || cart.length === 0}
                      className="w-full bg-teal-500 hover:bg-teal-600 text-white h-10"
                    >
                      {isSaving ? (
                        <>
                          <Loader className="h-4 w-4 animate-spin mr-2" />
                          Enregistrement...
                        </>
                      ) : (
                        "Confirmer la vente"
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de la vente */}
      <Dialog open={confirmSaleDialogOpen} onOpenChange={setConfirmSaleDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold text-blue-600">
              ⚠️ Confirmation de vente
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700 font-medium mb-4">
              Confirmez-vous cette vente ?
            </p>

            {/* Détails des articles du panier */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Détails du panier:</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-center pb-2 border-b border-gray-200 last:border-b-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.nom}</p>
                      <p className="text-xs text-gray-500">
                        {item.prix.toFixed(2)} DH × {item.quantite} = <span className="font-semibold text-gray-700">{(item.prix * item.quantite).toFixed(2)} DH</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-semibold">
                        Qté: {item.quantite}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Résumé */}
            <div className="bg-white p-4 border-2 border-teal-200 rounded-lg mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Nombre d'articles:</span>
                <span className="font-semibold">{cart.length}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Quantité totale:</span>
                <span className="font-semibold">{cart.reduce((sum, item) => sum + item.quantite, 0)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t-2 border-teal-200">
                <span className="text-gray-800 font-bold">Montant total:</span>
                <span className="font-bold text-teal-600 text-lg">{cartTotal.toFixed(2)} DH</span>
              </div>
            </div>

            <p className="text-gray-500 text-xs text-center mb-4">
              Cette action ne peut pas être annulée immédiatement après confirmation.
            </p>
          </div>
          <DialogFooter className="flex gap-3">
            <Button
              onClick={handleCancelSale}
              variant="outline"
              className="flex-1"
              disabled={isSaving}
            >
              Annuler
            </Button>
            <Button
              onClick={handleConfirmSale}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                  Traitement...
                </>
              ) : (
                "Confirmer la vente"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour le succès de la vente */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-green-600">
              ✓ Vente enregistrée avec succès!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-gray-700 font-medium mb-6">
              La vente a été enregistrée et le panier a été vidé.
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

      {/* Dialog Stock Insuffisant */}
      <Dialog open={insufficientStockDialogOpen} onOpenChange={setInsufficientStockDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2M7.08 6.47A9 9 0 1121 12a9 9 0 01-13.92-5.53" />
              </svg>
              Stock insuffisant
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              {insufficientStockItems.length === 1
                ? "Le produit suivant n'a pas assez de stock:"
                : "Les produits suivants n'ont pas assez de stock:"}
            </p>

            <div className="space-y-3">
              {insufficientStockItems.map((item, index) => (
                <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="font-semibold text-gray-800 mb-2">{item.nom}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Stock disponible:</span>
                      <p className="font-bold text-red-600 text-lg">{item.stock}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Quantité demandée:</span>
                      <p className="font-bold text-orange-600 text-lg">{item.demande}</p>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-red-200">
                    <span className="text-xs text-red-700 font-semibold">
                      Manquent: {item.demande - item.stock} unités
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-600 italic bg-yellow-50 border border-yellow-200 rounded p-2">
              💡 Veuillez réduire les quantités ou retirer les articles avant de confirmer la vente.
            </p>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setInsufficientStockDialogOpen(false)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold h-10"
            >
              OK - Modifier le panier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Snackbar pour les erreurs */}
      <Snackbar
        open={errorSnackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseErrorSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert 
          onClose={handleCloseErrorSnackbar} 
          severity="error"
          sx={{ width: "100%", fontWeight: 500 }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
