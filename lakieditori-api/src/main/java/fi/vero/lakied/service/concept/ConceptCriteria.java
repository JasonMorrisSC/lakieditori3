package fi.vero.lakied.service.concept;

import com.google.common.base.Strings;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.criteria.StringFieldValueCriteria;
import java.util.Objects;
import org.w3c.dom.Document;

public final class ConceptCriteria {

  private ConceptCriteria() {
  }

  public static Criteria<String, Document> byUri(String uri) {
    return new StringFieldValueCriteria<String, Document>("uri", uri) {
      @Override
      public boolean test(String key, Document document) {
        return Objects.equals(key, uri);
      }
    };
  }

  public static Criteria<String, Document> byQuery(String query) {
    return new StringFieldValueCriteria<String, Document>("query", query) {
      @Override
      public boolean test(String key, Document document) {
        return Strings.nullToEmpty(document.getTextContent()).contains(query);
      }
    };
  }

}
