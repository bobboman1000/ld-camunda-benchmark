package edu.kit.aifb.gsm;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.LinkedList;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

/**
 * @author benjaminjochum on 03.02.20.
 * @version 1.0
 */
@Service
public class ExternalDataService {

    private Logger logger = Logger.getLogger("INFO");
    private String tableName = "device";

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private List<Triple> tripleList = new LinkedList<>();

    public ExternalDataService() {
    }

    @PostConstruct
    public void initTable() {
        try {
            jdbcTemplate.execute("CREATE TABLE " + tableName + " (subject VARCHAR(300), predicate VARCHAR(300), object VARCHAR(300));");
        } catch (DataAccessException e) {
            logger.info("Existing table found. Using the old one");
        }
    }

    public void read() {
        Logger.getLogger("INFO").info("Reading");
        tripleList = this.jdbcTemplate.query(
                "SELECT subject, predicate, object FROM " + tableName,
                (rs, rowNum) -> new Triple(
                            rs.getString("subject"),
                            rs.getString("predicate"),
                            rs.getString("object")));
    }

    public List<Triple> getTriplesForId(String subjectId) {
        read();
       return tripleList
               .stream()
               .filter(triple -> triple.subject.equals(subjectId))
               .collect(Collectors.toList());
    }

    public List<Triple> getTriplesObjects(String subjectId, String predicate) {
        return getTriplesForId(subjectId)
                .stream()
                .filter(triple -> triple.predicate.equals(predicate))
                .collect(Collectors.toList());
    }

    public List<Triple> getTriple(String subjectId, String predicate, String object) {
        return getTriplesObjects(subjectId, predicate)
                .stream()
                .filter(triple -> triple.object.equals(object))
                .collect(Collectors.toList());
    }

    public boolean getBoolTriple(String subjectId, String predicate, String object) {
        List<Triple> list = getTriple(subjectId, predicate, object);
        if (list.size() != 1) {
            return false;
        }
        return list.get(0).object.equals("true^^<http://www.w3.org/2001/XMLSchema#boolean>");
    }
}
