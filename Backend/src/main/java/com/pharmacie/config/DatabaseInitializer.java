package com.pharmacie.config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;

@Configuration
public class DatabaseInitializer {

    @Bean
    public ApplicationRunner init(DataSource dataSource) {
        return args -> {
            try (Connection connection = dataSource.getConnection();
                 Statement statement = connection.createStatement()) {
                
                // Modifier la colonne patient_id pour la rendre nullable
                try {
                    statement.execute("ALTER TABLE ventes ALTER COLUMN patient_id DROP NOT NULL");
                    System.out.println("✓ patient_id is now nullable");
                } catch (Exception e) {
                    System.out.println("⚠ patient_id constraint update skipped: " + e.getMessage());
                }
                
                // Modifier la colonne medecin_id pour la rendre nullable
                try {
                    statement.execute("ALTER TABLE ventes ALTER COLUMN medecin_id DROP NOT NULL");
                    System.out.println("✓ medecin_id is now nullable");
                } catch (Exception e) {
                    System.out.println("⚠ medecin_id constraint update skipped: " + e.getMessage());
                }
                
            } catch (Exception e) {
                System.err.println("❌ Database initialization error: " + e.getMessage());
                e.printStackTrace();
            }
        };
    }
}
