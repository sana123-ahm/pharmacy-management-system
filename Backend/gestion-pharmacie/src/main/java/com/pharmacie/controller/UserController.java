package com.pharmacie.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
}
