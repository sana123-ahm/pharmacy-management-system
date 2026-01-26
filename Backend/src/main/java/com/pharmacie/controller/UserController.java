package com.pharmacie.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pharmacie.dto.Register;
import com.pharmacie.service.RegisterService;

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
}
