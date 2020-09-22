package fi.vero.lakied.repository;

import fi.vero.lakied.repository.document.DocumentKey;
import fi.vero.lakied.util.common.Empty;
import fi.vero.lakied.util.common.Tuple;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.security.User;
import fi.vero.lakied.util.xml.XmlDocumentBuilder;
import fi.vero.lakied.util.xml.XmlUtils;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import org.w3c.dom.Document;

@Transactional
@SpringBootTest
public class DocumentRepositoryTest {

  private final User user = User.builder()
      .randomId()
      .username("testUser")
      .randomPassword()
      .build();

  private final String schemaName = "example-schema";

  @Autowired
  private WriteRepository<UUID, User> userWriteRepository;

  @Autowired
  private WriteRepository<String, Empty> schemaWriteRepository;

  @Autowired
  private WriteRepository<Tuple2<String, Integer>, Tuple2<String, Document>> schemaDefinitionWriteRepository;

  @Autowired
  private WriteRepository<DocumentKey, Document> documentWriteRepository;

  @BeforeEach
  void setUp() {
    User testLoader = User.superuser("test-loader");

    userWriteRepository.insert(UUID.randomUUID(), user, testLoader);
    schemaWriteRepository.insert(schemaName, Empty.INSTANCE, testLoader);
    schemaDefinitionWriteRepository.insert(
        Tuple.of(schemaName, 1),
        Tuple.of("example.xsd",
            XmlUtils.parseUnchecked("<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n"
                + "<xs:schema xmlns:xs=\"http://www.w3.org/2001/XMLSchema\">\n"
                + "  <xs:element name=\"person\">\n"
                + "    <xs:complexType>\n"
                + "      <xs:sequence>\n"
                + "        <xs:element name=\"name\" type=\"xs:string\"/>\n"
                + "      </xs:sequence>\n"
                + "      <xs:attribute name=\"id\" type=\"xs:string\" use=\"required\"/>\n"
                + "    </xs:complexType>\n"
                + "  </xs:element>\n"
                + "</xs:schema>")), testLoader);
  }

  @Test
  void shouldInsertNewDocument() {
    Document exampleDocument = XmlDocumentBuilder.builder()
        .pushElement("person").attribute("id", "123")
        .pushElement("name").text("Jack")
        .build();

    documentWriteRepository.insert(
        DocumentKey.of(schemaName, UUID.randomUUID()), exampleDocument, user);
  }

}
