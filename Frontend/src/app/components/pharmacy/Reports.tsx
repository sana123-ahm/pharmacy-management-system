import { useEffect, useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Calendar, TrendingUp, DollarSign, Loader, AlertCircle, RefreshCw } from "lucide-react";
import venteService, { type Vente } from "../../services/venteService";
import medicamentService from "../../services/medicamentService";
import { PeriodFilter } from "./PeriodFilter";

export function Reports() {
  const [ventes, setVentes] = useState<Vente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [periodLabel, setPeriodLabel] = useState("Toutes les données");
  const [showAllMeds, setShowAllMeds] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("Chargement des ventes pour le rapport...");
      const ventesData = await venteService.getAllVentes();
      console.log("Ventes chargées:", ventesData);
      console.log("Nombre de ventes:", ventesData.length);
      setVentes(ventesData);
      setPeriodLabel("Toutes les données");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erreur lors du chargement des données";
      console.error("Erreur chargement rapports:", errorMsg, err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFilterChange = (filteredVentes: Vente[], label: string) => {
    console.log("Filtre appliqué - Ventes filtrées:", filteredVentes.length);
    setVentes(filteredVentes);
    setPeriodLabel(label);
  };

  // Calculer le Top 10 des médicaments les plus vendus
  const topMedicaments = Array.from(
    ventes
      .flatMap((v) => v.lignes || [])
      .filter((ligne) => ligne && ligne.medicament && ligne.medicament.nom)
      .reduce((acc, ligne) => {
        const key = ligne.medicament.nom;
        if (!acc.has(key)) {
          acc.set(key, {
            nom: key,
            units: 0,
            revenue: 0,
          });
        }
        const current = acc.get(key)!;
        current.units += ligne.quantite || 0;
        current.revenue += (ligne.quantite || 0) * (ligne.prixUnitaire || 0);
        return acc;
      }, new Map<string, any>())
      .values()
  )
    .sort((a, b) => b.units - a.units)
    .slice(0, 10)
    .map((item, index) => ({
      rank: index + 1,
      name: item.nom,
      units: item.units,
      revenue: item.revenue.toFixed(2),
      trend: "+5%", // Évolution simplifiée
    }));

  // Données mensuelles (6 derniers mois)
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - (5 - i));
    const monthName = month.toLocaleString("fr-FR", { month: "short" });

    const monthVentes = ventes.filter((v) => {
      const vDate = new Date(v.date);
      return (
        vDate.getMonth() === month.getMonth() &&
        vDate.getFullYear() === month.getFullYear()
      );
    });

    const totalAmount = monthVentes.reduce((sum, v) => sum + v.montantTotal, 0);
    const prescriptionVentes = monthVentes.filter((v) => v.avecOrdonnance);
    const prescriptionAmount = prescriptionVentes.reduce((sum, v) => sum + v.montantTotal, 0);

    return {
      month: monthName,
      ventes: Math.round(totalAmount),
      prescriptions: Math.round(prescriptionAmount),
      sansOrdonnance: Math.round(totalAmount - prescriptionAmount),
    };
  });

  // Données pour les catégories (basé sur la distribution des ventes)
  const categoryData = Array.from(
    ventes
      .flatMap((v) => v.lignes || [])
      .filter((ligne) => ligne && ligne.medicament && ligne.medicament.nom)
      .reduce((acc, ligne) => {
        const key = ligne.medicament.nom;
        if (!acc.has(key)) {
          acc.set(key, 0);
        }
        acc.set(key, (acc.get(key) || 0) + (ligne.quantite || 0));
        return acc;
      }, new Map())
      .entries()
  )
    .slice(0, 5)
    .map(([name, count], index) => ({
      name,
      value: count,
      color: ["#14b8a6", "#3b82f6", "#8b5cf6", "#f59e0b", "#10b981"][index % 5],
    }));

  // Données hebdomadaires
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - i));
    const dayName = day.toLocaleString("fr-FR", { weekday: "short" });

    const dayVentes = ventes.filter((v) => {
      const vDate = new Date(v.date);
      return vDate.toDateString() === day.toDateString();
    });

    return {
      day: dayName,
      transactions: dayVentes.length,
      montant: Math.round(dayVentes.reduce((sum, v) => sum + v.montantTotal, 0) * 100) / 100,
    };
  });

  const totalRevenue = ventes.reduce((sum, v) => sum + v.montantTotal, 0);
  const totalVentes = ventes.length;
  const averageSale = totalVentes > 0 ? Math.round((totalRevenue / totalVentes) * 100) / 100 : 0;

  const stats = [
    {
      title: "CA Total",
      value: `${totalRevenue.toFixed(2)} DH`,
      change: totalVentes > 10 ? "+12.5%" : "N/A",
      isPositive: true,
      icon: <DollarSign className="h-6 w-6 text-green-600" />,
    },
    {
      title: "Ventes Totales",
      value: totalVentes.toString(),
      change: totalVentes > 10 ? "+8.3%" : "N/A",
      isPositive: true,
      icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
    },
    {
      title: "Vente Moyenne",
      value: `${averageSale.toFixed(2)} DH`,
      change: "+4.1%",
      isPositive: true,
      icon: <Calendar className="h-6 w-6 text-purple-600" />,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="h-10 w-10 animate-spin text-teal-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Rapports & Statistiques</h1>
          <p className="text-gray-600">Analyse du chiffre d'affaires et des ventes</p>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-6 w-6 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold mb-2">Erreur lors du chargement des rapports</p>
            <p className="text-sm mb-4">{error}</p>
            <button
              onClick={loadData}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (ventes.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Rapports & Statistiques</h1>
          <p className="text-gray-600">Analyse du chiffre d'affaires et des ventes</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-6 py-4 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-6 w-6 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold mb-2">Aucune vente enregistrée</p>
            <p className="text-sm mb-4">Les données apparaîtront ici une fois que vous aurez créé des ventes.</p>
            <button
              onClick={loadData}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Recharger
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Rapports & Statistiques</h1>
        <p className="text-gray-600">Analyse du chiffre d'affaires et des ventes - <span className="font-semibold text-teal-600">{periodLabel}</span></p>
      </div>

      {/* Filtre par Période */}
      <PeriodFilter onFilterChange={handleFilterChange} loading={loading} />

      {/* Afficher les erreurs */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                {stat.icon}
              </div>
              <span className={`text-sm font-semibold ${
                stat.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Évolution des ventes mensuelles */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Chiffre d'affaires mensuel
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="prescriptions" name="Avec ordonnance" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="sansOrdonnance" name="Sans ordonnance" fill="#14b8a6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Répartition par catégorie */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Ventes par catégorie
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Évolution hebdomadaire */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Activité de la semaine
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis yAxisId="left" stroke="#6b7280" />
              <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="transactions" 
                name="Nombre de transactions"
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="montant" 
                name="Montant (DH)"
                stroke="#14b8a6" 
                strokeWidth={3}
                dot={{ fill: '#14b8a6', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tableau des performances */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Top 10 des médicaments les plus vendus
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Rang
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Médicament
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Unités vendues
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  CA généré
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Évolution
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topMedicaments.length > 0 ? (
                (showAllMeds ? topMedicaments : topMedicaments.slice(0, 10)).map((item) => (
                  <tr key={item.rank} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-teal-100 text-teal-700 font-bold">
                        {item.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {item.units}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {item.revenue} DH
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.trend.startsWith('+') 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.trend}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Aucune donnée de ventes disponible
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {topMedicaments.length > 10 && (
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
                    <span>Voir plus ({topMedicaments.length - 10})</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}