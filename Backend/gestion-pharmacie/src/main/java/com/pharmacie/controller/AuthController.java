package com.pharmacie.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pharmacie.config.JwtUtil;
import com.pharmacie.dto.AuthResponse;
import com.pharmacie.dto.Register;
import com.pharmacie.model.Utilisateur;
import com.pharmacie.service.RegisterService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class AuthController {

    private final RegisterService registerService;
    private final JwtUtil jwtUtil;

    public AuthController(RegisterService registerService, JwtUtil jwtUtil) {
        this.registerService = registerService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody Register register) {
        try {
            if (register.getLogin() == null || register.getLogin().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new AuthResponse("Login is required"));
            }
            if (register.getMotDePasse() == null || register.getMotDePasse().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new AuthResponse("Password is required"));
            }

            Utilisateur user = registerService.register(register.getLogin(), register.getMotDePasse());
            String token = jwtUtil.generateToken(user.getLogin());

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new AuthResponse(token, user.getLogin(), user.getId(), "Registration successful"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new AuthResponse("User already exists"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new AuthResponse("Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody Register register) {
        try {
            if (register.getLogin() == null || register.getLogin().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new AuthResponse("Login is required"));
            }
            if (register.getMotDePasse() == null || register.getMotDePasse().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new AuthResponse("Password is required"));
            }

            boolean authenticated = registerService.authenticate(register.getLogin(), register.getMotDePasse());

            if (authenticated) {
                String token = jwtUtil.generateToken(register.getLogin());
                Utilisateur user = registerService.findByLogin(register.getLogin());
                return ResponseEntity.ok(
                        new AuthResponse(token, user.getLogin(), user.getId(), "Login successful"));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new AuthResponse("Invalid credentials"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new AuthResponse("Login failed: " + e.getMessage()));
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<AuthResponse> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new AuthResponse("Invalid token format"));
            }

            String token = authHeader.substring(7);
            if (jwtUtil.validateToken(token)) {
                String login = jwtUtil.extractUsername(token);
                Utilisateur user = registerService.findByLogin(login);
                return ResponseEntity.ok(
                        new AuthResponse(token, user.getLogin(), user.getId(), "Token is valid"));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new AuthResponse("Invalid token"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse("Token validation failed"));
        }
    }
}
