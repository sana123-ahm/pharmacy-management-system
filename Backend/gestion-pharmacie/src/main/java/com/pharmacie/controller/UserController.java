package com.pharmacie.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.pharmacie.dto.Register;
import com.pharmacie.model.Utilisateur;
import com.pharmacie.service.RegisterService;
import java.util.List;

@RestController                    
@RequestMapping("/api/users")       
public class UserController {

    private final RegisterService registerService;

    public UserController(RegisterService registerService) {
        this.registerService = registerService;
    }

    @PostMapping("/register")        
    public ResponseEntity<String> register(@RequestBody Register register) {

        registerService.register(
            register.getLogin(),
            register.getMotDePasse() 
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Inscription réussie");
    }
 
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Register register) {    
        boolean authenticated = registerService.authenticate(
            register.getLogin(),
            register.getMotDePasse()
        );

        if (authenticated) {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body("Connexion réussie");
        } else {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Échec de la connexion ! Vérifiez les identifiants.");
        }
    }
    
    // Déconnexion de l'utilisateur
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null) {
                SecurityContextHolder.clearContext();
                return ResponseEntity
                        .status(HttpStatus.OK)
                        .body("Déconnexion réussie");
            }
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body("Aucune session active");
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Erreur lors de la déconnexion: " + e.getMessage());
        }
    }

    // Lister tous les utilisateurs
    @GetMapping("/all")
    public ResponseEntity<List<Utilisateur>> getAllUsers() {
        try {
            List<Utilisateur> users = registerService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }

    // Supprimer un utilisateur par ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        try {
            boolean deleted = registerService.deleteUser(id);
            if (deleted) {
                return ResponseEntity
                        .status(HttpStatus.OK)
                        .body("Utilisateur supprimé avec succès");
            } else {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Utilisateur non trouvé");
            }
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la suppression: " + e.getMessage());
        }
    }

    // Supprimer plusieurs utilisateurs
    @DeleteMapping("/bulk-delete")
    public ResponseEntity<String> deleteMultipleUsers(@RequestBody List<Long> ids) {
        try {
            int deletedCount = registerService.deleteMultipleUsers(ids);
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(deletedCount + " utilisateur(s) supprimé(s) avec succès");
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la suppression: " + e.getMessage());
        }
    }
}
