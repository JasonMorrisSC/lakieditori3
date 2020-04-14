package fi.vero.lakied.web;

import static fi.vero.lakied.util.common.ResourceUtils.forAllResourcesAsString;
import static io.restassured.RestAssured.given;

import java.nio.file.FileSystems;
import java.nio.file.PathMatcher;
import org.apache.http.HttpStatus;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

class DocumentUtilsControllerTest extends BaseApiIntegrationTest {

  @Test
  void shouldValidateExampleXmlDocuments() {
    PathMatcher xmlFileMatcher = FileSystems.getDefault().getPathMatcher("glob:**/*.xml");

    forAllResourcesAsString("example-documents", xmlFileMatcher::matches, (path, document) ->
        given(adminAuthorizedRequest)
            .contentType(MediaType.APPLICATION_XML_VALUE)
            .body(document)
            .post("/api/validate")
            .then()
            .statusCode(HttpStatus.SC_NO_CONTENT));
  }

}