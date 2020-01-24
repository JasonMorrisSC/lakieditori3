package fi.vero.lakied.util;

import static fi.vero.lakied.util.common.ResourceUtils.allResourcesToString;
import static fi.vero.lakied.util.common.ResourceUtils.resourceToString;

import fi.vero.lakied.util.xml.XmlUtils;
import java.io.IOException;
import java.io.StringReader;
import java.nio.file.FileSystems;
import java.nio.file.PathMatcher;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.Schema;
import org.junit.jupiter.api.Test;
import org.xml.sax.SAXException;

class DocumentSchemaTest {

  private Schema schema = XmlUtils.parseSchema(resourceToString("schemas/document.xsd"));

  private void validate(String xml) {
    try {
      schema.newValidator().validate(new StreamSource(new StringReader(xml)));
    } catch (SAXException | IOException e) {
      throw new AssertionError(e);
    }
  }

  @Test
  void shouldValidateExampleDocuments() {
    PathMatcher xmlFileMatcher = FileSystems.getDefault().getPathMatcher("glob:**/*.xml");

    allResourcesToString("example-documents", xmlFileMatcher::matches)
        .forEach(this::validate);
  }
}
