package edu.kit.aifb.gsm;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author benjaminjochum on 31.01.20.
 * @version 1.0
 */
@RestController("/")
public class BaseResource {

    @Autowired
    ExternalDataService externalDataService;

    @GetMapping("/update")
    public String update() {
        long start = System.currentTimeMillis();
        externalDataService.read();
        return "Finished reading DB: Elapsed time: " + timeSince(start) + "\n";
    }

    private String timeSince(long startTime) {
        return System.currentTimeMillis() - startTime + " ms,";
    }
}
