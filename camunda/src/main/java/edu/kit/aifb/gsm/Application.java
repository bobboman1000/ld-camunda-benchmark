package edu.kit.aifb.gsm;

import org.camunda.bpm.spring.boot.starter.annotation.EnableProcessApplication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableProcessApplication("GSM")
public class Application {

  @Autowired
  private ExternalDataService externalDataService;

  @Autowired
  private TimeLoggingService timeLoggingService;

  public static void main(String[] args) {
    SpringApplication.run(Application.class);
  }
}
