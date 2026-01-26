import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { Calendar } from "lucide-react";
import venteService, { type Vente } from "../../services/venteService";

interface PeriodFilterProps {
  onFilterChange: (ventes: Vente[], periodLabel: string) => void;
  loading?: boolean;
}

export function PeriodFilter({ onFilterChange, loading = false }: PeriodFilterProps) {
  const [filterType, setFilterType] = useState<"jour" | "semaine" | "mois" | "trimestre" | "semestre" | "annee">("mois");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedTrimestre, setSelectedTrimestre] = useState(1);
  const [selectedSemestre, setSelectedSemestre] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    { value: 1, label: "Janvier" },
    { value: 2, label: "Février" },
    { value: 3, label: "Mars" },
    { value: 4, label: "Avril" },
    { value: 5, label: "Mai" },
    { value: 6, label: "Juin" },
    { value: 7, label: "Juillet" },
    { value: 8, label: "Août" },
    { value: 9, label: "Septembre" },
    { value: 10, label: "Octobre" },
    { value: 11, label: "Novembre" },
    { value: 12, label: "Décembre" },
  ];

  const handleFilter = async () => {
    setIsLoading(true);
    try {
      let ventes: Vente[] = [];
      let periodLabel = "";

      switch (filterType) {
        case "jour":
          const today = new Date();
          ventes = await venteService.getVentesByJour(today);
          periodLabel = `Aujourd'hui - ${today.toLocaleDateString("fr-FR")}`;
          break;

        case "semaine":
          ventes = await venteService.getVentesBySemaine(selectedYear, selectedWeek);
          periodLabel = `Semaine ${selectedWeek} de ${selectedYear}`;
          break;

        case "mois":
          ventes = await venteService.getVentesByMois(selectedYear, selectedMonth);
          const monthName = months.find(m => m.value === selectedMonth)?.label || "";
          periodLabel = `${monthName} ${selectedYear}`;
          break;

        case "trimestre":
          ventes = await venteService.getVentesByTrimestre(selectedYear, selectedTrimestre);
          periodLabel = `Trimestre ${selectedTrimestre} ${selectedYear} (Q${selectedTrimestre})`;
          break;

        case "semestre":
          ventes = await venteService.getVentesBySemestre(selectedYear, selectedSemestre);
          periodLabel = `Semestre ${selectedSemestre} ${selectedYear}`;
          break;

        case "annee":
          ventes = await venteService.getVentesByAnnee(selectedYear);
          periodLabel = `Année ${selectedYear}`;
          break;
      }

      onFilterChange(ventes, periodLabel);
    } catch (error) {
      console.error("Erreur lors du filtrage:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-teal-500 rounded-lg">
          <Calendar className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-teal-900 text-lg">Filtrer par Période</h3>
          <p className="text-teal-700 text-sm">Sélectionnez la période pour afficher les ventes</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Filter Type Selection */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <button
            onClick={() => setFilterType("jour")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterType === "jour"
                ? "bg-teal-500 text-white shadow-md"
                : "bg-white text-teal-700 border border-teal-200 hover:bg-teal-50"
            }`}
          >
            Par Jour
          </button>
          <button
            onClick={() => setFilterType("semaine")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterType === "semaine"
                ? "bg-teal-500 text-white shadow-md"
                : "bg-white text-teal-700 border border-teal-200 hover:bg-teal-50"
            }`}
          >
            Par Semaine
          </button>
          <button
            onClick={() => setFilterType("mois")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterType === "mois"
                ? "bg-teal-500 text-white shadow-md"
                : "bg-white text-teal-700 border border-teal-200 hover:bg-teal-50"
            }`}
          >
            Par Mois
          </button>
          <button
            onClick={() => setFilterType("trimestre")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterType === "trimestre"
                ? "bg-teal-500 text-white shadow-md"
                : "bg-white text-teal-700 border border-teal-200 hover:bg-teal-50"
            }`}
          >
            Par Trimestre
          </button>
          <button
            onClick={() => setFilterType("semestre")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterType === "semestre"
                ? "bg-teal-500 text-white shadow-md"
                : "bg-white text-teal-700 border border-teal-200 hover:bg-teal-50"
            }`}
          >
            Par Semestre
          </button>
          <button
            onClick={() => setFilterType("annee")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterType === "annee"
                ? "bg-teal-500 text-white shadow-md"
                : "bg-white text-teal-700 border border-teal-200 hover:bg-teal-50"
            }`}
          >
            Par Année
          </button>
        </div>

        {/* Dynamic Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Année */}
          {filterType !== "jour" && (
            <div>
              <label className="text-sm font-semibold text-teal-900 mb-2 block">Année</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full px-3 py-2 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Mois */}
          {filterType === "mois" && (
            <div>
              <label className="text-sm font-semibold text-teal-900 mb-2 block">Mois</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="w-full px-3 py-2 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Semaine */}
          {filterType === "semaine" && (
            <div>
              <label className="text-sm font-semibold text-teal-900 mb-2 block">Semaine (1-52)</label>
              <input
                type="number"
                min="1"
                max="52"
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(Number(e.target.value))}
                className="w-full px-3 py-2 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          )}

          {/* Trimestre */}
          {filterType === "trimestre" && (
            <div>
              <label className="text-sm font-semibold text-teal-900 mb-2 block">Trimestre (1-4)</label>
              <select
                value={selectedTrimestre}
                onChange={(e) => setSelectedTrimestre(Number(e.target.value))}
                className="w-full px-3 py-2 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value={1}>Q1 (Jan-Mar)</option>
                <option value={2}>Q2 (Avr-Juin)</option>
                <option value={3}>Q3 (Juil-Sep)</option>
                <option value={4}>Q4 (Oct-Déc)</option>
              </select>
            </div>
          )}

          {/* Semestre */}
          {filterType === "semestre" && (
            <div>
              <label className="text-sm font-semibold text-teal-900 mb-2 block">Semestre (1-2)</label>
              <select
                value={selectedSemestre}
                onChange={(e) => setSelectedSemestre(Number(e.target.value))}
                className="w-full px-3 py-2 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value={1}>S1 (Jan-Juin)</option>
                <option value={2}>S2 (Juil-Déc)</option>
              </select>
            </div>
          )}
        </div>

        {/* Apply Button */}
        <Button
          onClick={handleFilter}
          disabled={isLoading || loading}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded-lg transition-all"
        >
          {isLoading ? "Chargement..." : "Appliquer le Filtre"}
        </Button>
      </div>
    </div>
  );
}
