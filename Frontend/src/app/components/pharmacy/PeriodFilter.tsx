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
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-teal-500 rounded-lg">
          <Calendar className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Filtrer par Période</h3>
          <p className="text-gray-600 text-sm">Sélectionnez le type et la période de filtrage</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Type de Période - Une seule ligne */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-3 block">Type de Période</label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {[
              { value: "jour", label: "Jour" },
              { value: "semaine", label: "Semaine" },
              { value: "mois", label: "Mois" },
              { value: "trimestre", label: "Trimestre" },
              { value: "semestre", label: "Semestre" },
              { value: "annee", label: "Année" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilterType(option.value as any)}
                className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                  filterType === option.value
                    ? "bg-teal-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Options de Filtrage - Organisées selon le type */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="space-y-4">
            {/* Année - Visible pour tous sauf "jour" */}
            {filterType !== "jour" && (
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Année</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Mois - Visible pour "mois" */}
            {filterType === "mois" && (
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Mois</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Semaine - Visible pour "semaine" */}
            {filterType === "semaine" && (
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Numéro de Semaine (1-52)</label>
                <input
                  type="number"
                  min="1"
                  max="52"
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(Math.min(52, Math.max(1, Number(e.target.value))))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            )}

            {/* Trimestre - Visible pour "trimestre" */}
            {filterType === "trimestre" && (
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Trimestre</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: 1, label: "Q1", desc: "Jan-Mar" },
                    { value: 2, label: "Q2", desc: "Avr-Juin" },
                    { value: 3, label: "Q3", desc: "Juil-Sep" },
                    { value: 4, label: "Q4", desc: "Oct-Déc" },
                  ].map((q) => (
                    <button
                      key={q.value}
                      onClick={() => setSelectedTrimestre(q.value)}
                      className={`p-2 rounded-lg font-medium transition-all text-sm ${
                        selectedTrimestre === q.value
                          ? "bg-teal-500 text-white"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      <div>{q.label}</div>
                      <div className="text-xs opacity-75">{q.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Semestre - Visible pour "semestre" */}
            {filterType === "semestre" && (
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Semestre</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 1, label: "S1", desc: "Jan-Juin" },
                    { value: 2, label: "S2", desc: "Juil-Déc" },
                  ].map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setSelectedSemestre(s.value)}
                      className={`p-2 rounded-lg font-medium transition-all text-sm ${
                        selectedSemestre === s.value
                          ? "bg-teal-500 text-white"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      <div>{s.label}</div>
                      <div className="text-xs opacity-75">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bouton Appliquer */}
        <Button
          onClick={handleFilter}
          disabled={isLoading || loading}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-lg transition-all shadow-md"
        >
          {isLoading || loading ? (
            <>
              <span className="mr-2">⏳</span>
              Chargement...
            </>
          ) : (
            <>
              <span className="mr-2">🔍</span>
              Appliquer le Filtre
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
