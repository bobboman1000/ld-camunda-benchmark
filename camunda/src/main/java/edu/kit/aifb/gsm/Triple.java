package edu.kit.aifb.gsm;

/**
 * @author benjaminjochum on 03.02.20.
 * @version 1.0
 */
public class Triple {
    public final String subject;
    public final String predicate;
    public final String object;

    public Triple(String subject, String predicate, String object) {
        this.subject = subject;
        this.predicate = predicate;
        this.object = object;
    }
}
