package com.gateway.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@Profile("local")
@EnableScheduling
public class LocalTestConfig {
    // Local test configuration
    // Uses H2 in-memory database and local Redis
    // API endpoint: http://localhost:8000
}

