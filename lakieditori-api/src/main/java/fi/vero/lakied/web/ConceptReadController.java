package fi.vero.lakied.web;

import static fi.vero.lakied.util.json.JsonElementFactory.object;
import static fi.vero.lakied.util.json.JsonElementFactory.primitive;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.google.common.collect.ImmutableSet;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.User;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.xml.GetXmlMapping;
import fi.vero.lakied.util.xml.XmlDocumentBuilder;
import java.util.Arrays;
import java.util.Set;
import java.util.concurrent.ExecutionException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.w3c.dom.Document;

@RestController
@RequestMapping("/api/concepts")
public class ConceptReadController {

  private final ReadRepository<String, Document> conceptReadRepository;
  private final Cache<String, Document> queryCache = CacheBuilder.newBuilder().softValues().build();
  private final Set<String> stopWords = ImmutableSet
      .copyOf(Arrays.asList("tai", "kui", "luku", "noja", "voi", "jolla"));

  public ConceptReadController(ReadRepository<String, Document> conceptReadRepository) {
    this.conceptReadRepository = conceptReadRepository;
  }

  @GetXmlMapping
  public Document get(@RequestParam("query") String query, @AuthenticationPrincipal User user)
      throws ExecutionException {
    return queryCache.get(query, () -> {
      XmlDocumentBuilder builder = new XmlDocumentBuilder().pushElement("concepts");

      if (!query.isEmpty() && !stopWords.contains(query)) {
        Criteria<String, Document> criteria = Criteria.json(object("query", primitive(query)));
        conceptReadRepository.forEachEntry(criteria, user,
            (id, concept) -> builder.pushExternal(concept.getDocumentElement()).pop());
      }

      return builder.build();
    });
  }

}
