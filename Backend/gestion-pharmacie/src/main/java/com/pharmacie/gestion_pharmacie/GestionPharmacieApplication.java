package com.pharmacie.gestion_pharmacie;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"com.pharmacie"})
@EnableJpaRepositories(basePackages = {"com.pharmacie.repository"})
@EntityScan(basePackages = {"com.pharmacie.model"})
public class GestionPharmacieApplication {

    public static void main(String[] args) {
        SpringApplication.run(GestionPharmacieApplication.class, args);
    }
}
