package com.clearpath.backend.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;

import javax.sql.DataSource;
import java.util.HashMap;

@Configuration
@EnableJpaRepositories(
        basePackages = "com.clearpath.backend.repository.quiz",
        entityManagerFactoryRef = "quizEntityManagerFactory",
        transactionManagerRef = "quizTransactionManager"
)
public class QuizDataSourceConfig {

    @Bean(name = "quizDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.quiz")
    public DataSource quizDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "quizEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean quizEntityManagerFactory(
            @Qualifier("quizDataSource") DataSource dataSource) {
        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(dataSource);
        em.setPackagesToScan("com.clearpath.backend.entity.quiz");
        HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        em.setJpaVendorAdapter(vendorAdapter);
        HashMap<String, Object> properties = new HashMap<>();
        properties.put("hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");
        properties.put("hibernate.hbm2ddl.auto", "none");
        em.setJpaPropertyMap(properties);
        return em;
    }

    @Bean(name = "quizTransactionManager")
    public JpaTransactionManager quizTransactionManager(
            @Qualifier("quizEntityManagerFactory") LocalContainerEntityManagerFactoryBean factory) {
        return new JpaTransactionManager(factory.getObject());
    }
}