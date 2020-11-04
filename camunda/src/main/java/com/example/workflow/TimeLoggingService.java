package com.example.workflow;

import org.springframework.stereotype.Service;

import java.util.logging.Logger;

/**
 * @author benjaminjochum on 03.02.20.
 * @version 1.0
 */
@Service
public class TimeLoggingService {

    Logger logger = Logger.getLogger("WF-TIME");

    public TimeLoggingService() {
    }

    public boolean log(String message) {
        logger.info(System.currentTimeMillis() + " " + message);
        return true;
    }
}
