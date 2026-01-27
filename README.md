# 🏥 PharmaGest - Système de Gestion de Pharmacie

Application complète de gestion de pharmacie avec prédictions IA, génération de factures PDF et dashboard analytique.

---

## 📋 Table des Matières

- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Lancement](#lancement)
- [API Documentation](#api-documentation)
- [Sécurité](#sécurité)

---

## 🛠️ Technologies

### Backend
- **Framework** : Spring Boot 3.2.2
- **Java** : 21 LTS
- **Base de données** : PostgreSQL
- **Authentification** : JWT + Spring Security
- **API Doc** : Swagger/OpenAPI 3.1
- **PDF** : iText 7.2.5

### Frontend
- **Framework** : React 19
- **Build Tool** : Vite
- **Styling** : Tailwind CSS + Radix UI
- **State Management** : React Hooks + Context

---

## ⚙️ Installation

### Prérequis
- Java 21 JDK
- Node.js 18+
- PostgreSQL 12+
- Maven 3.6+

### 1. Backend - Configuration

```bash
cd Backend

# Copier le fichier d'environnement
cp .env.example .env

# Éditer .env avec vos credentials
# DB_PASSWORD=votre_mot_de_passe
# DB_HOST=votre_serveur_postgres
```

### 2. Frontend - Installation

```bash
cd Frontend

# Installer les dépendances
npm install

# (Optionnel) Copier .env si vous avez des variables d'environnement
cp .env.example .env
```

---

## 🔐 Configuration Sécurisée

### Variables d'Environnement (Backend)

Créez un fichier `.env` basé sur `.env.example` :

```properties
# Obligatoire
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gestion_pharmacie
DB_USERNAME=postgres
DB_PASSWORD=votre_mot_de_passe_complexe

# Optionnel (defaults inclus)
SERVER_PORT=8081
JWT_SECRET=votre_clé_secrète
ENVIRONMENT=development
```

### Activation des Variables d'Environnement

**Option 1 : Variables système (Linux/Mac)**
```bash
export DB_HOST=localhost
export DB_PASSWORD=votre_mot_de_passe
mvnw spring-boot:run
```

**Option 2 : Variables système (Windows CMD)**
```cmd
set DB_HOST=localhost
set DB_PASSWORD=votre_mot_de_passe
mvnw spring-boot:run
```

**Option 3 : Fichier application-prod.properties**
```properties
# src/main/resources/application-prod.properties
spring.profiles.active=prod
spring.datasource.url=jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
```

---

## 🚀 Lancement

### Backend
```bash
cd Backend
mvnw spring-boot:run
# ou
mvnw clean install
java -jar target/gestion-pharmacie-0.0.1-SNAPSHOT.jar
```

✅ Backend disponible sur `http://localhost:8081`

### Frontend
```bash
cd Frontend
npm run dev
```

✅ Frontend disponible sur `http://localhost:5173`

---

## 📚 API Documentation

**Swagger UI** : `http://localhost:8081/swagger-ui.html`

**API Docs** : `http://localhost:8081/v3/api-docs`

---

## 🔒 Sécurité

### Points Clés
✅ JWT pour authentification  
✅ Spring Security activée  
✅ CORS configuré  
✅ Hashage BCrypt pour mots de passe  
✅ Authentification requise sur tous les endpoints (sauf /auth)  

### Avant Production
- ❌ Ne PAS commiter `.env`
- ✅ Utilisez `.env.example` pour la documentation
- ✅ Changez tous les mots de passe par défaut
- ✅ Générez une clé JWT secrète forte
- ✅ Activez HTTPS
- ✅ Validez CORS pour les domaines de production

---

## 📊 Fonctionnalités

✅ Gestion complète des ventes et factures  
✅ Génération automatique de factures PDF  
✅ Prédictions IA - Ventes & Chiffre d'Affaires  
✅ Filtrage avancé par patient, médecin, ordonnance, facture  
✅ Dashboard analytique avec KPIs  
✅ Gestion des patients, médecins, médicaments  
✅ Authentification JWT sécurisée  
✅ API REST complète  

---

## 📞 Support

Pour toute question, consulter la documentation API Swagger ou le code source.

---

**Prêt pour la production ! 🚀**
