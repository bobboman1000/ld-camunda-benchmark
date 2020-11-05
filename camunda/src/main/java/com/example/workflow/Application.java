package com.example.workflow;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.annotation.PostConstruct;

@SpringBootApplication
public class Application {

  @Autowired
  TimeLoggingService timeLoggingService;

  @Autowired
  private JdbcTemplate jdbcTemplate;

  public static void main(String[] args) {
    SpringApplication.run(Application.class);
  }

  @PostConstruct
  public void alterTable() {
    jdbcTemplate.execute("ALTER TABLE ACT_RU_VARIABLE ALTER TEXT_ CLOB");
    jdbcTemplate.execute("ALTER TABLE ACT_HI_VARINST ALTER TEXT_ CLOB");
    jdbcTemplate.execute("ALTER TABLE ACT_HI_DETAIL ALTER TEXT_ CLOB");
  }

}
