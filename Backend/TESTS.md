# 🧪 Guide des Tests - PharmaGest

## 📋 Vue d'ensemble

Ce document décrit la stratégie de test pour l'application PharmaGest, incluant :
- ✅ Tests unitaires
- ✅ Tests d'intégration
- ✅ Tests des contrôleurs
- ✅ Couverture de code

---

## 🗂️ Structure des Tests

```
Backend/
├── src/test/java/com/pharmacie/
│   ├── service/
│   │   ├── FactureServiceTest.java       ✅ Tests de génération PDF
│   │   └── VenteServiceTest.java         ✅ Tests des ventes
│   ├── controller/
│   │   └── AuthControllerTest.java       ✅ Tests d'authentification
│   └── ApplicationIntegrationTest.java   ✅ Tests d'intégration
└── src/test/resources/
    └── application-test.properties       ⚙️ Configuration de test
```

---

## ✅ Tests Disponibles

### 1. **FactureServiceTest** - Génération de Factures
Tests : 6 tests unitaires

```bash
✓ Doit générer une facture avec succès
✓ Doit retourner une facture existante au lieu d'en créer une nouvelle
✓ Doit lever une exception si la vente n'existe pas
✓ Doit générer un PDF non null
✓ Doit gérer les erreurs lors de la génération PDF
✓ Doit récupérer une facture existante
```

### 2. **VenteServiceTest** - Gestion des Ventes
Tests : 11 tests unitaires

```bash
✓ Doit récupérer toutes les ventes
✓ Doit récupérer une vente par ID
✓ Doit retourner vide si la vente n'existe pas
✓ Doit créer une nouvelle vente
✓ Doit mettre à jour une vente existante
✓ Doit supprimer une vente
✓ Doit calculer le montant total des ventes
✓ Doit filtrer les ventes avec patient
✓ Doit valider qu'une vente a un montant positif
✓ Doit rejeter une vente avec montant négatif
✓ Doit valider qu'une vente a une date
```

### 3. **AuthControllerTest** - Authentification
Tests : 7 tests contrôleur

```bash
✓ Doit accepter une requête login avec username et password
✓ Doit rejeter une requête login sans credentials
✓ Doit accepter une requête register
✓ Doit avoir un endpoint /auth/login
✓ Doit avoir un endpoint /auth/register
✓ Doit retourner du JSON en réponse
✓ Doit avoir les bons status HTTP
```

### 4. **ApplicationIntegrationTest** - Intégration Complète
Tests : 10 tests d'intégration

```bash
✓ L'application doit démarrer correctement
✓ Swagger UI doit être accessible
✓ Endpoint /api-docs doit être accessible
✓ Le serveur doit répondre aux requêtes
✓ CORS doit être activé pour localhost:5173
✓ L'authentification doit être requise pour les endpoints protégés
✓ Le endpoint /api/auth/login doit être accessible
✓ Les migrations de base de données doivent être appliquées
✓ Doit gérer les erreurs HTTP 404 correctement
✓ Doit accepter les requêtes JSON
```

---

## 🚀 Exécuter les Tests

### Tous les tests
```bash
cd Backend
mvnw test
```

### Tests spécifiques
```bash
# Tests d'un fichier
mvnw test -Dtest=FactureServiceTest

# Tests d'une méthode
mvnw test -Dtest=FactureServiceTest#testGenerateAndSaveFacture_Success
```

### Avec rapport de couverture
```bash
mvnw test jacoco:report
# Rapport : target/site/jacoco/index.html
```

### Tests avec logs détaillés
```bash
mvnw test -X
```

---

## 📊 Couverture de Code

### Configuration JaCoCo (déjà en place)

Ajouter au `pom.xml` si nécessaire :

```xml
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.8.10</version>
    <executions>
        <execution>
            <goals>
                <goal>prepare-agent</goal>
            </goals>
        </execution>
        <execution>
            <id>report</id>
            <phase>test</phase>
            <goals>
                <goal>report</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

### Générer le rapport
```bash
mvnw clean test jacoco:report
# Ouvrir : target/site/jacoco/index.html
```

---

## 🧪 Framework et Outils Utilisés

- **JUnit 5** : Framework de test
- **Mockito** : Mocking des dépendances
- **MockMvc** : Tests des contrôleurs
- **TestRestTemplate** : Tests d'intégration
- **H2 Database** : BD de test en mémoire
- **JaCoCo** : Couverture de code

---

## 📝 Conventions de Test

### Nommage des Méthodes
```java
testMethodName_Condition_ExpectedResult()

Exemples :
- testGenerateAndSaveFacture_Success()
- testGenerateAndSaveFacture_VenteNotFound()
- testCalculateTotalSalesAmount()
```

### Annotation @DisplayName
```java
@DisplayName("Doit générer une facture avec succès")
void testGenerateAndSaveFacture_Success() { }
```

### Pattern AAA (Arrange-Act-Assert)
```java
void test() {
    // Arrange - Configuration
    Long venteId = 1L;
    
    // Act - Exécution
    Facture result = factureService.generateAndSaveFacture(venteId);
    
    // Assert - Vérification
    assertNotNull(result);
}
```

---

## ✅ Checklist de Test

Avant de déployer, vérifiez :

- [ ] Tous les tests passent : `mvnw test`
- [ ] Couverture > 70% : `mvnw test jacoco:report`
- [ ] Pas de warnings : `mvnw clean test`
- [ ] Tests documentés avec @DisplayName
- [ ] Mocking approprié (Mockito)
- [ ] Tests d'intégration complets
- [ ] Tests des cas d'erreur

---

## 🔧 Ajouter de Nouveaux Tests

### 1. Créer le fichier test
```java
// src/test/java/com/pharmacie/service/MonServiceTest.java
@SpringBootTest
class MonServiceTest {
    @Mock
    private MonRepository monRepository;
    
    @InjectMocks
    private MonService monService;
    
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    
    @Test
    @DisplayName("Description du test")
    void testMonMethode() {
        // Arrange
        // Act
        // Assert
    }
}
```

### 2. Exécuter les tests
```bash
mvnw test -Dtest=MonServiceTest
```

### 3. Vérifier la couverture
```bash
mvnw test jacoco:report
```

---

## 📚 Ressources

- [JUnit 5 Documentation](https://junit.org/junit5/)
- [Mockito Guide](https://javadoc.io/doc/org.mockito/mockito-core/)
- [Spring Boot Testing](https://spring.io/guides/gs/testing-web/)
- [JaCoCo Plugin](https://www.jacoco.org/jacoco/trunk/doc/maven.html)

---

**Statut** : ✅ Tests en place et opérationnels

**Prochaines étapes** : 
- [ ] Augmenter la couverture à 80%+
- [ ] Ajouter des tests de performance
- [ ] Tests d'UI Frontend (Cypress/Vitest)
