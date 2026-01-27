package com.pharmacie.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.VerticalAlignment;
import com.pharmacie.dto.LigneVenteDTO;
import com.pharmacie.dto.VenteDTO;
import com.pharmacie.model.Facture;
import com.pharmacie.model.LigneVente;
import com.pharmacie.model.Vente;
import com.pharmacie.repository.FactureRepository;
import com.pharmacie.repository.VenteRepository;

@Service
@Transactional
public class FactureService {
    
    private final FactureRepository factureRepository;
    private final VenteRepository venteRepository;

    public FactureService(FactureRepository factureRepository, VenteRepository venteRepository) {
        this.factureRepository = factureRepository;
        this.venteRepository = venteRepository;
    }

    public byte[] generateFacturePDF(VenteDTO vente) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc);

        // Set font - use built-in Courier which is always available
        PdfFont regularFont = PdfFontFactory.createFont("Courier");
        PdfFont boldFont = PdfFontFactory.createFont("Courier-Bold");

        // En-tête
        Paragraph header = new Paragraph("FACTURE")
                .setFont(boldFont)
                .setFontSize(24)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(20);
        document.add(header);

        // Numéro et date de facture
        Paragraph invoiceInfo = new Paragraph()
                .add("Numéro de facture: ").setFont(boldFont)
                .add("FAC-" + vente.getId() + "\n")
                .add("Date: ").setFont(boldFont)
                .add(formatDate(vente.getDate()) + "\n")
                .setFont(regularFont)
                .setFontSize(11)
                .setMarginBottom(20);
        document.add(invoiceInfo);

        // Pharmacie info
        Paragraph pharmacyInfo = new Paragraph()
                .add("PHARMACIE HORIZON\n")
                .setFont(boldFont)
                .add("Bd Bir Anzarane, Quartier Maarif\n")
                .add("Tél: +212 610 56 77 06\n")
                .add("Email: pharmahorizon@gmail.com\n")
                .setFont(regularFont)
                .setFontSize(10)
                .setMarginBottom(20);
        document.add(pharmacyInfo);

        // Patient/Client info si présent
        if (vente.getPatientNom() != null && !vente.getPatientNom().isEmpty()) {
            Paragraph clientInfo = new Paragraph()
                    .add("Patient: ").setFont(boldFont)
                    .add(vente.getPatientNom() + "\n")
                    .setFont(regularFont)
                    .setFontSize(11)
                    .setMarginBottom(10);
            document.add(clientInfo);
        }

        // Médecin info si présent
        if (vente.getMedecinNom() != null && !vente.getMedecinNom().isEmpty()) {
            Paragraph medecinInfo = new Paragraph()
                    .add("Médecin: ").setFont(boldFont)
                    .add(vente.getMedecinNom() + "\n")
                    .setFont(regularFont)
                    .setFontSize(11)
                    .setMarginBottom(20);
            document.add(medecinInfo);
        }

        // Table des articles
        Table table = new Table(5);
        table.setWidth(com.itextpdf.layout.properties.UnitValue.createPercentValue(100));

        // Headers
        addHeaderCell(table, "Médicament");
        addHeaderCell(table, "Quantité");
        addHeaderCell(table, "Prix unitaire");
        addHeaderCell(table, "Total");
        addHeaderCell(table, "");

        // Lignes de vente
        double totalHT = 0;
        if (vente.getLignes() != null) {
            for (LigneVenteDTO ligne : vente.getLignes()) {
                table.addCell(new Cell().add(new Paragraph(ligne.getMedicamentNom()).setFont(regularFont)));
                table.addCell(new Cell().add(new Paragraph(String.valueOf(ligne.getQuantite())).setFont(regularFont)));
                table.addCell(new Cell().add(new Paragraph(String.format("%.2f DH", ligne.getPrixUnitaire())).setFont(regularFont)));
                double lineTotal = ligne.getQuantite() * ligne.getPrixUnitaire();
                table.addCell(new Cell().add(new Paragraph(String.format("%.2f DH", lineTotal)).setFont(regularFont)));
                table.addCell(new Cell().add(new Paragraph("")));
                totalHT += lineTotal;
            }
        }

        document.add(table);

        // Totals
        Paragraph totals = new Paragraph()
                .setMarginTop(20)
                .add("Montant HT: ").setFont(boldFont)
                .add(String.format("%.2f DH\n", totalHT))
                .add("Montant TTC: ").setFont(boldFont)
                .add(String.format("%.2f DH\n", vente.getMontantTotal()))
                .setFont(regularFont)
                .setFontSize(12)
                .setTextAlignment(TextAlignment.RIGHT);
        document.add(totals);

        // Ordonnance info
        if (vente.isAvecOrdonnance()) {
            Paragraph prescriptionNote = new Paragraph()
                    .setMarginTop(20)
                    .add("☑ Vente avec ordonnance")
                    .setFont(boldFont)
                    .setFontSize(11)
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(prescriptionNote);
        } else {
            Paragraph noPrescriptionNote = new Paragraph()
                    .setMarginTop(20)
                    .add("☐ Vente sans ordonnance")
                    .setFont(regularFont)
                    .setFontSize(11)
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(noPrescriptionNote);
        }

        // Footer
        Paragraph footer = new Paragraph()
                .setMarginTop(30)
                .add("Merci pour votre visite!")
                .setFont(regularFont)
                .setFontSize(10)
                .setTextAlignment(TextAlignment.CENTER);
        document.add(footer);

        document.close();
        return baos.toByteArray();
    }

    // Méthode pour générer et sauvegarder une facture en DB
    @Transactional
    public Facture generateAndSaveFacture(Long venteId) {
        Optional<Vente> venteOpt = venteRepository.findById(venteId);
        if (!venteOpt.isPresent()) {
            System.err.println("Erreur: Vente non trouvée avec l'ID: " + venteId);
            throw new RuntimeException("Vente not found with id: " + venteId);
        }

        Vente vente = venteOpt.get();
        
        // Vérifier si une facture existe déjà
        Optional<Facture> existingFacture = factureRepository.findByVente(vente);
        if (existingFacture.isPresent()) {
            System.out.println("Facture existante trouvée pour vente: " + venteId);
            return existingFacture.get();
        }

        try {
            System.out.println("Génération PDF pour vente: " + venteId);
            
            // Créer le DTO pour la génération PDF
            VenteDTO venteDTO = convertToDTO(vente);
            System.out.println("DTO créé avec " + (venteDTO.getLignes() != null ? venteDTO.getLignes().size() : 0) + " lignes");

            // Générer le PDF
            byte[] pdfContent = generateFacturePDF(venteDTO);
            System.out.println("PDF généré: " + pdfContent.length + " bytes");

            // Créer et sauvegarder la facture
            String numeroFacture = "FAC-" + vente.getId();
            Facture facture = new Facture(vente, pdfContent, numeroFacture);
            
            Facture factureSauvegardee = factureRepository.save(facture);
            System.out.println("Facture sauvegardée en BD avec ID: " + factureSauvegardee.getId());
            
            return factureSauvegardee;
        } catch (IOException ioException) {
            System.err.println("Erreur IO lors de la génération de la facture: " + ioException.getMessage());
            ioException.printStackTrace();
            // Relancer comme RuntimeException pour éviter la déclaration throws
            throw new RuntimeException("Erreur IO lors de la génération de la facture: " + ioException.getMessage(), ioException);
        } catch (Exception e) {
            System.err.println("Erreur générale lors de la génération de la facture: " + e.getMessage());
            System.err.println("Classe de l'exception: " + e.getClass().getName());
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de la génération de la facture: " + e.getMessage(), e);
        }
    }

    // Convertir Vente en VenteDTO - simplifié et plus robuste
    private VenteDTO convertToDTO(Vente vente) {
        VenteDTO dto = new VenteDTO();
        dto.setId(vente.getId());
        dto.setDate(vente.getDate());
        dto.setMontantTotal(vente.getMontantTotal());
        dto.setAvecOrdonnance(vente.isAvecOrdonnance());
        
        // Patient
        if (vente.getPatient() != null) {
            dto.setPatientNom(vente.getPatient().getNom());
            dto.setPatientId(vente.getPatient().getId());
        }
        
        // Médecin
        if (vente.getMedecin() != null) {
            dto.setMedecinNom(vente.getMedecin().getNom());
            dto.setMedecinId(vente.getMedecin().getId());
        }
        
        // Utilisateur
        if (vente.getUtilisateur() != null) {
            dto.setUtilisateurId(vente.getUtilisateur().getId());
        }
        
        // Convertir les lignes de vente
        if (vente.getLignes() != null && !vente.getLignes().isEmpty()) {
            for (LigneVente ligne : vente.getLignes()) {
                if (ligne != null && ligne.getMedicament() != null) {
                    LigneVenteDTO ligneDTO = new LigneVenteDTO();
                    ligneDTO.setMedicamentNom(ligne.getMedicament().getNom());
                    ligneDTO.setQuantite(ligne.getQuantite());
                    ligneDTO.setPrixUnitaire(ligne.getPrixUnitaire());
                    ligneDTO.setMedicamentId(ligne.getMedicament().getId());
                    
                    if (dto.getLignes() == null) {
                        dto.setLignes(new java.util.ArrayList<>());
                    }
                    dto.getLignes().add(ligneDTO);
                }
            }
        }
        
        return dto;
    }

    // Récupérer une facture par son ID
    public Facture getFactureById(Long factureId) {
        return factureRepository.findById(factureId)
                .orElseThrow(() -> new RuntimeException("Facture not found with id: " + factureId));
    }

    // Récupérer une facture par son vente ID
    public Facture getFactureByVenteId(Long venteId) {
        Optional<Vente> venteOpt = venteRepository.findById(venteId);
        if (!venteOpt.isPresent()) {
            throw new RuntimeException("Vente not found with id: " + venteId);
        }
        
        return factureRepository.findByVente(venteOpt.get())
                .orElseThrow(() -> new RuntimeException("Facture not found for vente id: " + venteId));
    }

    private void addHeaderCell(Table table, String text) {
        try {
            PdfFont boldFont = PdfFontFactory.createFont("Courier-Bold");
            Cell cell = new Cell()
                    .add(new Paragraph(text).setFont(boldFont))
                    .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setVerticalAlignment(VerticalAlignment.MIDDLE);
            table.addCell(cell);
        } catch (IOException e) {
            // Fallback if font creation fails
            Cell cell = new Cell()
                    .add(new Paragraph(text))
                    .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setVerticalAlignment(VerticalAlignment.MIDDLE);
            table.addCell(cell);
        }
    }

    private String formatDate(LocalDateTime dateTime) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        return dateTime.format(formatter);
    }
}
