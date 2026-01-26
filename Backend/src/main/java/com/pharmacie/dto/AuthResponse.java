package com.pharmacie.dto;

import com.pharmacie.model.Utilisateur;

public class AuthResponse {
    private String token;
    private String login;
    private Long userId;
    private String message;

    public AuthResponse(String token, String login, Long userId, String message) {
        this.token = token;
        this.login = login;
        this.userId = userId;
        this.message = message;
    }

    public AuthResponse(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
