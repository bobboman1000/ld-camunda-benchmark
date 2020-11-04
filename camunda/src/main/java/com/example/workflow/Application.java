package com.example.workflow;


import java.lang.System.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {

  @Autowired TimeLoggingService timeLoggingService;

  public static void main(String[] args) {
    SpringApplication.run(Application.class);
  }

  public static void print(String in) {
    System.out.println(in);
  }

}
