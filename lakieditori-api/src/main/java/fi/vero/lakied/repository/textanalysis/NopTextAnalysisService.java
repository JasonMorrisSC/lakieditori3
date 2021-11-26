package fi.vero.lakied.repository.textanalysis;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Set;

/**
 * Analysis service that just returns the given word.
 */
public class NopTextAnalysisService implements TextAnalysisService {

    private final Logger log = LoggerFactory.getLogger(getClass());

    public NopTextAnalysisService() {
        log.debug("Using {}", getClass().getName());
    }

    @Override
    public String lemma(String word, Set<String> tags, String lang) {
        return word;
    }

}
