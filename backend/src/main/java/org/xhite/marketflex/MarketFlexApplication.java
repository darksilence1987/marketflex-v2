package org.xhite.marketflex;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("org.xhite.marketflex.model")
@EnableJpaRepositories("org.xhite.marketflex.repository")
public class MarketFlexApplication {
    public static void main(String[] args) {
        SpringApplication.run(MarketFlexApplication.class, args);
    }
}