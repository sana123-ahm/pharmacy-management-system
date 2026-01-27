package com.pharmacie.service;

import java.io.IOException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import com.pharmacie.dto.VenteDTO;
import com.pharmacie.model.Facture;
import com.pharmacie.model.Vente;
import com.pharmacie.repository.FactureRepository;
import com.pharmacie.repository.VenteRepository;

@DisplayName("Tests Unitaires - FactureService")
class FactureServiceTest {

    @Mock
    private FactureRepository factureRepository;

    @Mock
    private VenteRepository venteRepository;

    @InjectMocks
    private FactureService factureService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Doit générer une facture avec succès")
    void testGenerateAndSaveFacture_Success() throws IOException {
        // Arrange
        Long venteId = 1L;
        Vente vente = new Vente();
        vente.setId(venteId);
        vente.setMontantTotal(150.00);

        when(venteRepository.findById(venteId)).thenReturn(Optional.of(vente));
        when(factureRepository.findByVente(vente)).thenReturn(Optional.empty());
        when(factureRepository.save(any(Facture.class))).thenAnswer(invocation -> {
            Facture facture = invocation.getArgument(0);
            facture.setId(1L);
            return facture;
        });

        // Act
        Facture result = factureService.generateAndSaveFacture(venteId);

        // Assert
        assertNotNull(result);
        assertEquals(venteId, result.getVente().getId());
        assertTrue(result.getNumeroFacture().startsWith("FAC-"));
        verify(factureRepository, times(1)).save(any(Facture.class));
    }

    @Test
    @DisplayName("Doit retourner une facture existante au lieu d'en créer une nouvelle")
    void testGenerateAndSaveFacture_ExistingFacture() throws IOException {
        // Arrange
        Long venteId = 1L;
        Vente vente = new Vente();
        vente.setId(venteId);

        Facture existingFacture = new Facture();
        existingFacture.setId(1L);
        existingFacture.setVente(vente);

        when(venteRepository.findById(venteId)).thenReturn(Optional.of(vente));
        when(factureRepository.findByVente(vente)).thenReturn(Optional.of(existingFacture));

        // Act
        Facture result = factureService.generateAndSaveFacture(venteId);

        // Assert
        assertNotNull(result);
        assertEquals(existingFacture.getId(), result.getId());
        verify(factureRepository, never()).save(any(Facture.class));
    }

    @Test
    @DisplayName("Doit lever une exception si la vente n'existe pas")
    void testGenerateAndSaveFacture_VenteNotFound() {
        // Arrange
        Long venteId = 999L;
        when(venteRepository.findById(venteId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            factureService.generateAndSaveFacture(venteId);
        });
        verify(factureRepository, never()).save(any(Facture.class));
    }

    @Test
    @DisplayName("Doit générer un PDF non null")
    void testGenerateFacturePDF_ReturnsValidPDF() throws IOException {
        // Arrange
        VenteDTO venteDTO = new VenteDTO();
        venteDTO.setId(1L);
        venteDTO.setMontantTotal(100.00);
        // Ajouter une date pour éviter les erreurs NPE
        venteDTO.setDate(java.time.LocalDateTime.now());

        // Act
        byte[] pdfBytes = factureService.generateFacturePDF(venteDTO);

        // Assert
        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 0);
        // Les fichiers PDF commencent par %PDF
        assertTrue(new String(pdfBytes, 0, Math.min(4, pdfBytes.length)).contains("%PDF"));
    }

    @Test
    @DisplayName("Doit gérer les erreurs lors de la génération PDF")
    void testGenerateFacturePDF_ThrowsException() {
        // Arrange
        VenteDTO venteDTO = null;

        // Act & Assert
        assertThrows(Exception.class, () -> {
            factureService.generateFacturePDF(venteDTO);
        });
    }

    @Test
    @DisplayName("Doit récupérer une facture existante")
    void testGetFactureByVente() {
        // Arrange
        Vente vente = new Vente();
        vente.setId(1L);

        Facture facture = new Facture();
        facture.setId(1L);

        when(factureRepository.findByVente(vente)).thenReturn(Optional.of(facture));

        // Act
        Optional<Facture> result = factureRepository.findByVente(vente);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(facture.getId(), result.get().getId());
    }
}
