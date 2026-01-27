import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus, Trash2, Edit2, Users, Stethoscope, Package, Pill, Lock, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { SearchableSelect } from '../ui/SearchableSelect';

interface Patient {
  id: number;
  nom: string;
  prenom: string;
}

interface Medecin {
  id: number;
  nom: string;
  prenom: string;
}

interface Fournisseur {
  id: number;
  nom: string;
}

interface Medicament {
  id: number;
  nom: string;
  prix: number;
  fournisseurId?: number;
}

interface User {
  id: number;
  login: string;
}

interface Message {
  type: 'success' | 'error';
  text: string;
}

export const AdminPanel: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [medecins, setMedecins] = useState<Medecin[]>([]);
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [medicaments, setMedicaments] = useState<Medicament[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [showAllPatients, setShowAllPatients] = useState(false);
  const [showAllMedecins, setShowAllMedecins] = useState(false);
  const [showAllFournisseurs, setShowAllFournisseurs] = useState(false);
  const [showAllMedicaments, setShowAllMedicaments] = useState(false);
  const [showAllUsers, setShowAllUsers] = useState(false);

  // Form states
  const [newPatient, setNewPatient] = useState({ nom: '', prenom: '' });
  const [newMedecin, setNewMedecin] = useState({ nom: '', prenom: '' });
  const [newFournisseur, setNewFournisseur] = useState({ nom: '' });
  const [newMedicament, setNewMedicament] = useState({ nom: '', prix: '', fournisseurId: null as number | null });
  const [newUser, setNewUser] = useState({ login: '', motDePasse: '', confirmPassword: '' });
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(false);

  const baseURL = 'http://localhost:8081/api';

  // Charger les données
  useEffect(() => {
    loadData();
  }, []);

  // Auto-hide message après 3 secondes
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const loadData = async () => {
    try {
      const [pRes, mRes, fRes, medRes, uRes] = await Promise.all([
        fetch(`${baseURL}/patients/all`),
        fetch(`${baseURL}/medicaments/all`),
        fetch(`${baseURL}/fournisseurs/all`),
        fetch(`${baseURL}/medecins/all`),
        fetch(`${baseURL}/users/all`),
      ]);

      if (pRes.ok) setPatients(await pRes.json());
      if (medRes.ok) setMedecins(await medRes.json());
      if (fRes.ok) setFournisseurs(await fRes.json());
      if (mRes.ok) setMedicaments(await mRes.json());
      if (uRes.ok) setUsers(await uRes.json());
    } catch (error) {
      console.error('Erreur lors du chargement des données', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des données' });
    }
  };

  const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ type, text });
  };

  // Ajouter patient
  const addPatient = async () => {
    if (!newPatient.nom || !newPatient.prenom) {
      showMessage('Veuillez remplir tous les champs', 'error');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/patients/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPatient),
      });
      if (response.ok) {
        showMessage('Patient ajouté avec succès', 'success');
        setNewPatient({ nom: '', prenom: '' });
        loadData();
      } else {
        showMessage('Erreur lors de l\'ajout du patient', 'error');
      }
    } catch (error) {
      showMessage('Erreur lors de l\'ajout du patient', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Ajouter médecin
  const addMedecin = async () => {
    if (!newMedecin.nom || !newMedecin.prenom) {
      showMessage('Veuillez remplir tous les champs', 'error');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/medecins/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMedecin),
      });
      if (response.ok) {
        showMessage('Médecin ajouté avec succès', 'success');
        setNewMedecin({ nom: '', prenom: '' });
        loadData();
      } else {
        showMessage('Erreur lors de l\'ajout du médecin', 'error');
      }
    } catch (error) {
      showMessage('Erreur lors de l\'ajout du médecin', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Ajouter fournisseur
  const addFournisseur = async () => {
    if (!newFournisseur.nom) {
      showMessage('Veuillez remplir le nom du fournisseur', 'error');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/fournisseurs/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFournisseur),
      });
      if (response.ok) {
        showMessage('Fournisseur ajouté avec succès', 'success');
        setNewFournisseur({ nom: '' });
        loadData();
      } else {
        showMessage('Erreur lors de l\'ajout du fournisseur', 'error');
      }
    } catch (error) {
      showMessage('Erreur lors de l\'ajout du fournisseur', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Ajouter médicament
  const addMedicament = async () => {
    if (!newMedicament.nom || !newMedicament.prix) {
      showMessage('Veuillez remplir tous les champs', 'error');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/medicaments/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: newMedicament.nom,
          prix: parseFloat(newMedicament.prix),
          fournisseurId: newMedicament.fournisseurId,
        }),
      });
      if (response.ok) {
        showMessage('Médicament ajouté avec succès', 'success');
        setNewMedicament({ nom: '', prix: '', fournisseurId: null });
        loadData();
      } else {
        showMessage('Erreur lors de l\'ajout du médicament', 'error');
      }
    } catch (error) {
      showMessage('Erreur lors de l\'ajout du médicament', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Ajouter utilisateur
  const addUser = async () => {
    if (!newUser.login || !newUser.motDePasse || !newUser.confirmPassword) {
      showMessage('Veuillez remplir tous les champs', 'error');
      return;
    }
    
    if (newUser.motDePasse.length < 6) {
      showMessage('Le mot de passe doit contenir au moins 6 caractères', 'error');
      return;
    }
    
    if (newUser.motDePasse !== newUser.confirmPassword) {
      showMessage('Les mots de passe ne correspondent pas', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8081/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login: newUser.login,
          motDePasse: newUser.motDePasse,
        }),
      });
      if (response.ok) {
        showMessage('Utilisateur créé avec succès', 'success');
        setNewUser({ login: '', motDePasse: '', confirmPassword: '' });
        loadData();
      } else {
        showMessage('Erreur lors de la création de l\'utilisateur', 'error');
      }
    } catch (error) {
      showMessage('Erreur lors de la création de l\'utilisateur', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un utilisateur
  const deleteUser = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/users/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        showMessage('Utilisateur supprimé avec succès', 'success');
        loadData();
      } else {
        showMessage('Erreur lors de la suppression de l\'utilisateur', 'error');
      }
    } catch (error) {
      showMessage('Erreur lors de la suppression de l\'utilisateur', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Supprimer plusieurs utilisateurs
  const deleteMultipleUsers = async (ids: number[]) => {
    if (ids.length === 0) {
      showMessage('Sélectionnez au moins un utilisateur', 'error');
      return;
    }

    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${ids.length} utilisateur(s) ?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/users/bulk-delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ids),
      });
      if (response.ok) {
        showMessage(`${ids.length} utilisateur(s) supprimé(s) avec succès`, 'success');
        loadData();
      } else {
        showMessage('Erreur lors de la suppression des utilisateurs', 'error');
      }
    } catch (error) {
      showMessage('Erreur lors de la suppression des utilisateurs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const DataTable = ({ title, items, columns, showAll, onToggleShowAll }: any) => (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
        <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
      </div>
      {items.length === 0 ? (
        <div className="px-8 py-16 text-center">
          <div className="text-gray-400 text-5xl mb-4">📋</div>
          <p className="text-gray-500 font-medium">Aucune donnée pour le moment</p>
          <p className="text-gray-400 text-sm">Les données apparaîtront ici une fois ajoutées</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody className="divide-y divide-gray-200">
                {(showAll ? items : items.slice(0, 15)).map((item: any, index: number) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-4 text-left">
                      <span className="text-gray-500 text-sm font-medium w-6 inline-block">#{index + 1}</span>
                    </td>
                    {columns.map((col: any) => (
                      <td key={col.key} className="px-8 py-4 text-sm text-gray-700">
                        {col.render ? col.render(item) : item[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {items.length > 15 && (
            <div className="px-8 py-4 border-t border-gray-200 flex justify-center bg-gray-50">
              <button
                onClick={onToggleShowAll}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors text-sm"
              >
                {showAll ? (
                  <>
                    <span>Voir moins</span>
                    <svg className="h-4 w-4 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </>
                ) : (
                  <>
                    <span>Voir plus ({items.length - 15})</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* En-tête avec gradient */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Gestion des données</h1>
        <p className="text-teal-100 text-lg">Administrez l'ensemble de votre base de données</p>
      </div>

      {/* Messages */}
      {message && (
        <div className={`flex items-start gap-3 p-4 rounded-lg border backdrop-blur ${
          message.type === 'success'
            ? 'bg-green-50/90 border-green-300 text-green-800'
            : 'bg-red-50/90 border-red-300 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          )}
          <p className="flex-1 text-sm font-medium">{message.text}</p>
        </div>
      )}

      <Tabs defaultValue="patients" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-gray-50 to-gray-100 p-2 rounded-xl shadow-sm border border-gray-200">
          <TabsTrigger value="patients" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-teal-600">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Patients</span>
          </TabsTrigger>
          <TabsTrigger value="medecins" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600">
            <Stethoscope className="h-4 w-4" />
            <span className="hidden sm:inline">Médecins</span>
          </TabsTrigger>
          <TabsTrigger value="fournisseurs" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-orange-600">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Fournisseurs</span>
          </TabsTrigger>
          <TabsTrigger value="utilisateurs" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-red-600">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Utilisateurs</span>
          </TabsTrigger>
        </TabsList>

        {/* PATIENTS */}
        <TabsContent value="patients" className="space-y-6 mt-6">
          <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-xl border border-teal-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-teal-500 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-teal-900 text-lg">Ajouter un nouveau patient</h3>
                <p className="text-teal-700 text-sm">Remplissez les informations du patient</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Input
                placeholder="Nom"
                value={newPatient.nom}
                onChange={(e) => setNewPatient({ ...newPatient, nom: e.target.value })}
                className="h-11 border-teal-200 focus:border-teal-500"
              />
              <Input
                placeholder="Prénom"
                value={newPatient.prenom}
                onChange={(e) => setNewPatient({ ...newPatient, prenom: e.target.value })}
                className="h-11 border-teal-200 focus:border-teal-500"
              />
            </div>
            <Button onClick={addPatient} disabled={loading} className="w-full bg-teal-500 hover:bg-teal-600 text-white h-11 font-semibold">
              {loading ? <Loader className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              Ajouter Patient
            </Button>
          </div>

          <DataTable
            title={`Patients (${patients.length})`}
            items={patients}
            showAll={showAllPatients}
            onToggleShowAll={() => setShowAllPatients(!showAllPatients)}
            columns={[
              { key: 'prenom', render: (p: Patient) => <span className="font-medium">{p.prenom}</span> },
              { key: 'nom', render: (p: Patient) => p.nom },
            ]}
          />
        </TabsContent>

        {/* MEDECINS */}
        <TabsContent value="medecins" className="space-y-6 mt-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-500 rounded-lg">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-blue-900 text-lg">Ajouter un nouveau médecin</h3>
                <p className="text-blue-700 text-sm">Enregistrez un médecin dans le système</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Input
                placeholder="Nom"
                value={newMedecin.nom}
                onChange={(e) => setNewMedecin({ ...newMedecin, nom: e.target.value })}
                className="h-11 border-blue-200 focus:border-blue-500"
              />
              <Input
                placeholder="Prénom"
                value={newMedecin.prenom}
                onChange={(e) => setNewMedecin({ ...newMedecin, prenom: e.target.value })}
                className="h-11 border-blue-200 focus:border-blue-500"
              />
            </div>
            <Button onClick={addMedecin} disabled={loading} className="w-full bg-blue-500 hover:bg-blue-600 text-white h-11 font-semibold">
              {loading ? <Loader className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              Ajouter Médecin
            </Button>
          </div>

          <DataTable
            title={`Médecins (${medecins.length})`}
            items={medecins}
            showAll={showAllMedecins}
            onToggleShowAll={() => setShowAllMedecins(!showAllMedecins)}
            columns={[
              { key: 'prenom', render: (m: Medecin) => <span className="font-medium">{m.prenom}</span> },
              { key: 'nom', render: (m: Medecin) => m.nom },
            ]}
          />
        </TabsContent>

        {/* FOURNISSEURS */}
        <TabsContent value="fournisseurs" className="space-y-6 mt-6">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl border border-orange-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-orange-500 rounded-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-orange-900 text-lg">Ajouter un nouveau fournisseur</h3>
                <p className="text-orange-700 text-sm">Enregistrez un fournisseur dans le système</p>
              </div>
            </div>
            <Input
              placeholder="Nom du fournisseur"
              value={newFournisseur.nom}
              onChange={(e) => setNewFournisseur({ ...newFournisseur, nom: e.target.value })}
              className="h-11 mb-4 border-orange-200 focus:border-orange-500"
            />
            <Button onClick={addFournisseur} disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 text-white h-11 font-semibold">
              {loading ? <Loader className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              Ajouter Fournisseur
            </Button>
          </div>

          <DataTable
            title={`Fournisseurs (${fournisseurs.length})`}
            items={fournisseurs}
            showAll={showAllFournisseurs}
            onToggleShowAll={() => setShowAllFournisseurs(!showAllFournisseurs)}
            columns={[
              { key: 'nom', render: (f: Fournisseur) => <span className="font-medium">{f.nom}</span> },
            ]}
          />
        </TabsContent>

        {/* UTILISATEURS */}
        <TabsContent value="utilisateurs" className="space-y-6 mt-6">
          <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl border border-red-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-500 rounded-lg">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-red-900 text-lg">Créer un nouvel utilisateur</h3>
                <p className="text-red-700 text-sm">Créez un compte pour un nouvel utilisateur</p>
              </div>
            </div>
            <div className="space-y-4 mb-4">
              <div>
                <label className="text-sm font-medium text-red-900 block mb-2">Étape 1: Nom d'utilisateur</label>
                <Input
                  placeholder="Login (nom d'utilisateur)"
                  value={newUser.login}
                  onChange={(e) => setNewUser({ ...newUser, login: e.target.value })}
                  className="h-11 border-red-200 focus:border-red-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-red-900 block mb-2">Étape 2: Mot de passe</label>
                <Input
                  type="password"
                  placeholder="Mot de passe"
                  value={newUser.motDePasse}
                  onChange={(e) => setNewUser({ ...newUser, motDePasse: e.target.value })}
                  className="h-11 border-red-200 focus:border-red-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-red-900 block mb-2">Étape 3: Confirmer le mot de passe</label>
                <Input
                  type="password"
                  placeholder="Confirmer le mot de passe"
                  value={newUser.confirmPassword}
                  onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                  className="h-11 border-red-200 focus:border-red-500"
                />
              </div>
            </div>
            <Button onClick={addUser} disabled={loading} className="w-full bg-red-500 hover:bg-red-600 text-white h-11 font-semibold">
              {loading ? <Loader className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              Créer Utilisateur
            </Button>
          </div>

          {/* Liste des utilisateurs */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-gray-600" />
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Utilisateurs ({users.length})</h3>
                  <p className="text-gray-600 text-sm">Gérez les comptes utilisateurs</p>
                </div>
              </div>
              {selectedUserIds.length > 0 && (
                <Button 
                  onClick={() => deleteMultipleUsers(selectedUserIds)} 
                  disabled={loading}
                  className="bg-red-500 hover:bg-red-600 text-white h-10"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer ({selectedUserIds.length})
                </Button>
              )}
            </div>

            {users.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun utilisateur trouvé</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedUserIds.length === users.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUserIds(users.map(u => u.id));
                            } else {
                              setSelectedUserIds([]);
                            }
                          }}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Nom d'utilisateur</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(showAllUsers ? users : users.slice(0, 15)).map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedUserIds.includes(user.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUserIds([...selectedUserIds, user.id]);
                              } else {
                                setSelectedUserIds(selectedUserIds.filter(id => id !== user.id));
                              }
                            }}
                            className="w-4 h-4 rounded border-gray-300"
                          />
                        </td>
                        <td className="py-3 px-4 text-gray-600 font-mono">{user.id}</td>
                        <td className="py-3 px-4 text-gray-900 font-medium">{user.login}</td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            onClick={() => deleteUser(user.id)}
                            disabled={loading}
                            className="bg-red-500 hover:bg-red-600 text-white h-9 px-3 inline-flex gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Supprimer
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length > 15 && (
                  <div className="px-4 py-4 border-t border-gray-200 flex justify-center bg-gray-50">
                    <button
                      onClick={() => setShowAllUsers(!showAllUsers)}
                      className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold transition-colors text-sm"
                    >
                      {showAllUsers ? (
                        <>
                          <span>Voir moins</span>
                          <svg className="h-4 w-4 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        </>
                      ) : (
                        <>
                          <span>Voir plus ({users.length - 15})</span>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};
