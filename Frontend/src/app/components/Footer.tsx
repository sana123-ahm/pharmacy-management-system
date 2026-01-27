import { Pill } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-950 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Pill className="h-8 w-8 text-teal-500" />
              <span className="text-2xl font-bold">PHARMAGEST</span>
            </div>
            <p className="text-gray-400">
              Système de gestion complet pour pharmacies. Gestion des ventes, 
              inventaire, factures et analyses prédictives.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#medicaments" className="hover:text-white transition-colors">Médicaments</a></li>
              <li><a href="#ventes" className="hover:text-white transition-colors">Ventes</a></li>
              <li><a href="#patients" className="hover:text-white transition-colors">Patients</a></li>
              <li><a href="#factures" className="hover:text-white transition-colors">Factures</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="mailto:contact@pharmagest.ma" className="hover:text-white transition-colors">Email</a></li>
              <li><a href="tel:+212610567706" className="hover:text-white transition-colors">Tél: +212 610 567 706</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} PharmaGest. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
