package fi.vero.lakied.web;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import fi.vero.lakied.service.textanalysis.TextAnalysisService;
import fi.vero.lakied.util.common.Tuple;
import fi.vero.lakied.util.common.Tuple3;
import java.util.Set;
import java.util.concurrent.ExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TextAnalysisController {

  private final TextAnalysisService textAnalysisService;
  private final Cache<Tuple3<String, Set<String>, String>, String> queryCache =
      CacheBuilder.newBuilder().softValues().build();

  @Autowired
  public TextAnalysisController(TextAnalysisService textAnalysisService) {
    this.textAnalysisService = textAnalysisService;
  }

  @GetMapping("/lemma")
  public String lemma(
      @RequestParam("word") String word,
      @RequestParam(name = "tag", defaultValue = "#{T(java.util.Collections).emptySet()}") Set<String> tags,
      @RequestParam(name = "lang", defaultValue = "fi") String lang) throws ExecutionException {
    return queryCache.get(Tuple.of(word, tags, lang),
        () -> textAnalysisService.lemma(word, tags, lang));
  }

}
