package fi.vero.lakied.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import fi.vero.lakied.repository.document.DocumentCriteria;
import fi.vero.lakied.repository.document.DocumentKey;
import fi.vero.lakied.repository.document.JdbcDocumentReadRepository;
import fi.vero.lakied.repository.document.JdbcDocumentWriteRepository;
import fi.vero.lakied.repository.schema.JdbcSchemaWriteRepository;
import fi.vero.lakied.repository.user.JdbcUserWriteRepository;
import fi.vero.lakied.util.common.Audited;
import fi.vero.lakied.util.common.Empty;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.security.User;
import fi.vero.lakied.util.xml.XmlUtils;
import java.util.UUID;
import javax.sql.DataSource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.transaction.annotation.Transactional;
import org.w3c.dom.Document;

@Transactional
@SpringBootTest
class JdbcDocumentRepositoryTest {

  @Autowired
  private DataSource dataSource;

  private ReadRepository<DocumentKey, Audited<Document>> documentReadRepository;
  private WriteRepository<DocumentKey, Document> documentWriteRepository;

  private final User user = User.superuser("ExampleUser");

  @BeforeEach
  void setUp() {
    JdbcUserWriteRepository userWriteRepository = new JdbcUserWriteRepository(dataSource);
    userWriteRepository.insert(UUID.randomUUID(), user, user);

    JdbcSchemaWriteRepository schemaWriteRepository = new JdbcSchemaWriteRepository(dataSource);
    schemaWriteRepository.insert("example", Empty.INSTANCE, user);

    this.documentReadRepository = new JdbcDocumentReadRepository(dataSource);
    this.documentWriteRepository = new JdbcDocumentWriteRepository(dataSource);
  }

  @Test
  void shouldInsertNewDocument() {
    UUID id = UUID.randomUUID();
    String xml = "<document><title>World!</title></document>";

    documentWriteRepository
        .insert(DocumentKey.of("example", id), XmlUtils.parseUnchecked(xml), user);

    assertEquals(1, documentReadRepository.count(DocumentCriteria.byKey("example", id), user));
  }

  @Test
  void shouldNotInsertDocumentTwice() {
    UUID id = UUID.randomUUID();
    String xml = "<document><title>World!</title></document>";

    documentWriteRepository
        .insert(DocumentKey.of("example", id), XmlUtils.parseUnchecked(xml), user);

    assertThrows(DataIntegrityViolationException.class, () -> documentWriteRepository
        .insert(DocumentKey.of("example", id), XmlUtils.parseUnchecked(xml), user));
  }

  @Test
  void shouldUpdateAndGetDocument() {
    UUID id = UUID.randomUUID();
    String xml = "<document><title>World!</title></document>";

    documentWriteRepository
        .insert(DocumentKey.of("example", id), XmlUtils.parseUnchecked(xml), user);

    assertEquals("World!", documentReadRepository.value(DocumentCriteria.byKey("example", id), user)
        .map(v -> v.value)
        .orElseThrow(AssertionError::new)
        .getElementsByTagName("title")
        .item(0)
        .getTextContent());

    documentWriteRepository.update(DocumentKey.of("example", id),
        XmlUtils.parseUnchecked("<document><title>World!!</title></document>"), user);

    assertEquals("World!!",
        documentReadRepository.value(DocumentCriteria.byKey("example", id), user)
            .map(v -> v.value)
            .orElseThrow(AssertionError::new)
            .getElementsByTagName("title")
            .item(0)
            .getTextContent());
  }

  @Test
  void shouldDeleteDocument() {
    UUID id = UUID.randomUUID();
    String xml = "<document><title>World!</title></document>";

    documentWriteRepository.insert(
        DocumentKey.of("example", id), XmlUtils.parseUnchecked(xml), user);

    assertEquals(1, documentReadRepository.count(DocumentCriteria.byKey("example", id), user));

    documentWriteRepository.delete(DocumentKey.of("example", id), user);

    assertEquals(0, documentReadRepository.count(DocumentCriteria.byKey("example", id), user));
  }

}
