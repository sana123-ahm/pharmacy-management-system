package com.pharmacie.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.pharmacie.model.Utilisateur;
import com.pharmacie.repository.UtilisateurRepository;
import java.util.List;
import java.util.Optional;

@Service
public class RegisterService {
    private final UtilisateurRepository UR;
    private final PasswordEncoder PE;

    public RegisterService(UtilisateurRepository UR
                        , PasswordEncoder PE) {
        this.UR = UR;
        this.PE = PE;   
    }
    public Utilisateur register(String login, String password) {
        // Hashage du mot de passe avant de sauvegarder l'utilisateur
        Utilisateur user = new Utilisateur();
        user.setLogin(login);
        user.setMotDePasse(password);

        if (UR.findByLogin(user.getLogin()) != null) {

            throw new RuntimeException("Login already exists");
        }
    
        String hashedPassword = PE.encode(user.getMotDePasse());
        user.setMotDePasse(hashedPassword);
        return UR.save(user);
    }
    public boolean authenticate(String login, String password) {
        Utilisateur user = UR.findByLogin(login);
        if (user == null) {
            return false; // Utilisateur non trouvé
        }
        // Vérification du mot de passe
        return PE.matches(password, user.getMotDePasse());
        
    }

    public Utilisateur findByLogin(String login) {
        return UR.findByLogin(login);
    }

    // Lister tous les utilisateurs
    public List<Utilisateur> getAllUsers() {
        return UR.findAll();
    }

    // Supprimer un utilisateur par ID
    public boolean deleteUser(Long id) {
        Optional<Utilisateur> user = UR.findById(id);
        if (user.isPresent()) {
            UR.deleteById(id);
            return true;
        }
        return false;
    }

    // Supprimer plusieurs utilisateurs
    public int deleteMultipleUsers(List<Long> ids) {
        int deletedCount = 0;
        for (Long id : ids) {
            if (deleteUser(id)) {
                deletedCount++;
            }
        }
        return deletedCount;
    }
}