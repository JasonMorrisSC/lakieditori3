package fi.vero.lakied.web;

import fi.vero.lakied.service.textanalysis.TextAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TextAnalysisController {

  private final TextAnalysisService textAnalysisService;

  @Autowired
  public TextAnalysisController(TextAnalysisService textAnalysisService) {
    this.textAnalysisService = textAnalysisService;
  }

  @GetMapping("/lemma")
  public String lemma(
      @RequestParam("word") String word,
      @RequestParam(name = "lang", defaultValue = "fi") String lang) {
    return textAnalysisService.lemma(word, lang);
  }

}
