package fi.vero.lakied.repository.textanalysis;

import java.util.Set;

public interface TextAnalysisService {

  String lemma(String word, Set<String> tags, String lang);

}
