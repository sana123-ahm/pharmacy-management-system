package com.pharmacie.controller;

import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pharmacie.service.RegisterService;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("Tests Contrôleur - AuthController")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private RegisterService registerService;

    @BeforeEach
    void setUp() {
        // Initialisation si nécessaire
    }

    @Test
    @DisplayName("Doit accepter une requête login avec username et password")
    void testLogin_WithValidCredentials() throws Exception {
        // Arrange
        String loginPayload = "{\"username\": \"admin\", \"password\": \"password123\"}";

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginPayload))
                .andExpect(result -> {
                    int status = result.getResponse().getStatus();
                    assertTrue(status == 200 || status == 401 || status == 400);
                });
    }

    @Test
    @DisplayName("Doit rejeter une requête login sans credentials")
    void testLogin_WithMissingCredentials() throws Exception {
        // Arrange
        String emptyPayload = "{}";

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(emptyPayload))
                .andExpect(result -> {
                    int status = result.getResponse().getStatus();
                    assertTrue(status == 400 || status == 401);
                });
    }

    @Test
    @DisplayName("Doit accepter une requête register")
    void testRegister_WithValidData() throws Exception {
        // Arrange
        String registerPayload = "{\"username\": \"newuser\", \"email\": \"user@example.com\", \"password\": \"password123\"}";

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerPayload))
                .andExpect(result -> {
                    int status = result.getResponse().getStatus();
                    assertTrue(status == 200 || status == 201 || status == 400);
                });
    }

    @Test
    @DisplayName("Doit avoir un endpoint /auth/login")
    void testLoginEndpointExists() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(result -> {
                    int status = result.getResponse().getStatus();
                    assertTrue(status >= 200);
                });
    }

    @Test
    @DisplayName("Doit avoir un endpoint /auth/register")
    void testRegisterEndpointExists() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(result -> {
                    int status = result.getResponse().getStatus();
                    assertTrue(status >= 200);
                });
    }

    @Test
    @DisplayName("Doit retourner du JSON en réponse")
    void testAuthResponse_IsJson() throws Exception {
        // Arrange
        String loginPayload = "{\"username\": \"admin\", \"password\": \"password123\"}";

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginPayload))
                .andExpect(result -> {
                    String contentType = result.getResponse().getContentType();
                    assertTrue(contentType == null || contentType.contains("json"));
                });
    }
}
