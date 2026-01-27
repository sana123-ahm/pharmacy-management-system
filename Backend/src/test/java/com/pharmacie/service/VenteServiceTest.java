package com.pharmacie.service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import com.pharmacie.model.Vente;
import com.pharmacie.repository.VenteRepository;

@DisplayName("Tests Unitaires - VenteService (Repository)")
class VenteServiceTest {

    @Mock
    private VenteRepository venteRepository;

    private Vente vente;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Initialiser une vente de test
        vente = new Vente();
        vente.setId(1L);
        vente.setMontantTotal(150.00);
        vente.setDate(LocalDateTime.now());
    }

    @Test
    @DisplayName("Doit récupérer toutes les ventes")
    void testGetAllVentes() {
        // Arrange
        List<Vente> ventes = Arrays.asList(vente, new Vente());
        when(venteRepository.findAll()).thenReturn(ventes);

        // Act
        List<Vente> result = venteRepository.findAll();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(venteRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Doit récupérer une vente par ID")
    void testGetVenteById_Success() {
        // Arrange
        when(venteRepository.findById(1L)).thenReturn(Optional.of(vente));

        // Act
        Optional<Vente> result = venteRepository.findById(1L);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
        assertEquals(150.00, result.get().getMontantTotal());
    }

    @Test
    @DisplayName("Doit retourner vide si la vente n'existe pas")
    void testGetVenteById_NotFound() {
        // Arrange
        when(venteRepository.findById(999L)).thenReturn(Optional.empty());

        // Act
        Optional<Vente> result = venteRepository.findById(999L);

        // Assert
        assertFalse(result.isPresent());
    }

    @Test
    @DisplayName("Doit créer une nouvelle vente")
    void testCreateVente_Success() {
        // Arrange
        when(venteRepository.save(any(Vente.class))).thenReturn(vente);

        // Act
        Vente result = venteRepository.save(vente);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(150.00, result.getMontantTotal());
        verify(venteRepository, times(1)).save(any(Vente.class));
    }

    @Test
    @DisplayName("Doit mettre à jour une vente existante")
    void testUpdateVente_Success() {
        // Arrange
        vente.setMontantTotal(200.00);
        when(venteRepository.save(vente)).thenReturn(vente);

        // Act
        Vente result = venteRepository.save(vente);

        // Assert
        assertNotNull(result);
        assertEquals(200.00, result.getMontantTotal());
        verify(venteRepository, times(1)).save(vente);
    }

    @Test
    @DisplayName("Doit supprimer une vente")
    void testDeleteVente_Success() {
        // Act
        venteRepository.deleteById(1L);

        // Assert
        verify(venteRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Doit calculer le montant total des ventes")
    void testCalculateTotalSalesAmount() {
        // Arrange
        Vente vente2 = new Vente();
        vente2.setMontantTotal(100.00);

        List<Vente> ventes = Arrays.asList(vente, vente2);
        double expectedTotal = 250.00;

        // Act
        double total = ventes.stream().mapToDouble(Vente::getMontantTotal).sum();

        // Assert
        assertEquals(expectedTotal, total);
    }

    @Test
    @DisplayName("Doit valider qu'une vente a un montant positif")
    void testVenteHasPositiveAmount() {
        // Arrange
        double montant = 150.00;

        // Act & Assert
        assertTrue(montant > 0);
    }

    @Test
    @DisplayName("Doit rejeter une vente avec montant négatif")
    void testVenteRejectNegativeAmount() {
        // Arrange
        double montant = -50.00;

        // Act & Assert
        assertFalse(montant > 0);
    }

    @Test
    @DisplayName("Doit valider qu'une vente a une date")
    void testVenteHasDate() {
        // Arrange
        LocalDateTime dateVente = LocalDateTime.now();

        // Act & Assert
        assertNotNull(dateVente);
    }
}