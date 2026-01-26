import { useEffect, useState } from "react";
import { Package, DollarSign, TrendingUp, ShoppingCart, AlertCircle, Loader } from "lucide-react";
import medicamentService, { type Medicament } from "../../services/medicamentService";
import venteService, { type Vente } from "../../services/venteService";

interface DashboardProps {
  userId?: number | null;
}

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

function StatsCard({ title, value, icon, trend, trendUp }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-teal-50 rounded-lg">
          {icon}
        </div>
        {trend && (
          <span className={`text-sm font-semibold ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

export function Dashboard({ userId }: DashboardProps) {
  const [medicaments, setMedicaments] = useState<Medicament[]>([]);
  const [ventes, setVentes] = useState<Vente[]>([]);
  const [lowStockMedicaments, setLowStockMedicaments] = useState<Medicament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        // Récupérer les médicaments
        const medsData = await medicamentService.getAllMedicaments();
        setMedicaments(medsData);

        // Récupérer les ventes du jour
        const ventesData = await venteService.getVentesToday();
        setVentes(ventesData);

        // Récupérer les médicaments en stock faible
        const lowStock = await medicamentService.getLowStockMedicaments();
        setLowStockMedicaments(lowStock);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement des données");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const stats = [
    {
      title: "Médicaments en stock",
      value: medicaments.length,
      icon: <Package className="h-6 w-6 text-teal-600" />,
      trend: medicaments.length > 0 ? "+12%" : "0",
      trendUp: true,
    },
    {
      title: "Ventes aujourd'hui",
      value: ventes.length,
      icon: <ShoppingCart className="h-6 w-6 text-blue-600" />,
      trend: ventes.length > 0 ? "+23%" : "0",
      trendUp: true,
    },
    {
      title: "Chiffre d'affaires (€)",
      value: ventes.reduce((sum, v) => sum + v.montantTotal, 0).toFixed(2),
      icon: <DollarSign className="h-6 w-6 text-green-600" />,
      trend: ventes.length > 0 ? "+8%" : "0",
      trendUp: true,
    },
    {
      title: "Produits à réapprovisionner",
      value: lowStockMedicaments.length,
      icon: <TrendingUp className="h-6 w-6 text-orange-600" />,
      trend: lowStockMedicaments.length > 0 ? "-5%" : "0",
      trendUp: false,
    },
  ];

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
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Tableau de bord</h1>
        <p className="text-gray-600">Vue d'ensemble de votre pharmacie</p>
      </div>

      {/* Afficher les erreurs */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Erreur lors du chargement</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Sections principales */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Ventes récentes */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Ventes récentes</h2>
          {ventes.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Aucune vente aujourd'hui</p>
          ) : (
            <div className="space-y-3">
              {ventes.slice(0, 5).map((vente) => (
                <div
                  key={vente.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-800">
                        {vente.patient?.nom || "Patient inconnu"}
                      </p>
                      {vente.avecOrdonnance && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          Ordonnance
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(vente.date).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-teal-600">{vente.montantTotal.toFixed(2)} DH</p>
                    <p className="text-xs text-gray-500">
                      {vente.lignes?.length || 0} article(s)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stock faible */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Alertes de stock
          </h2>
          {lowStockMedicaments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Tous les stocks sont corrects ✓</p>
          ) : (
            <div className="space-y-3">
              {lowStockMedicaments.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{item.nom}</p>
                    <p className="text-sm text-gray-600">
                      {item.fournisseur?.nom || "Fournisseur inconnu"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-orange-600">
                      {item.stock} unités
                    </p>
                    <p className="text-xs text-gray-500">Min: 50</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
