package fi.vero.lakied.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import fi.vero.lakied.service.document.DocumentCriteria;
import fi.vero.lakied.service.document.JdbcDocumentReadRepository;
import fi.vero.lakied.service.document.JdbcDocumentWriteRepository;
import fi.vero.lakied.service.user.JdbcUserWriteRepository;
import fi.vero.lakied.util.common.Audited;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.User;
import fi.vero.lakied.util.common.WriteRepository;
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

  private ReadRepository<UUID, Audited<Document>> documentReadRepository;
  private WriteRepository<UUID, Document> documentWriteRepository;

  private User user = User.of("ExampleUser");

  @BeforeEach
  void setUp() {
    JdbcUserWriteRepository userWriteRepository = new JdbcUserWriteRepository(dataSource);
    userWriteRepository.insert(user.getUsername(), user, user);

    this.documentReadRepository = new JdbcDocumentReadRepository(dataSource);
    this.documentWriteRepository = new JdbcDocumentWriteRepository(dataSource);
  }

  @Test
  void shouldInsertNewDocument() {
    UUID id = UUID.randomUUID();
    String xml = "<document><title>World!</title></document>";

    documentWriteRepository.insert(id, XmlUtils.parseUnchecked(xml), user);

    assertEquals(1, documentReadRepository.count(DocumentCriteria.byId(id), user));
  }

  @Test
  void shouldNotInsertDocumentTwice() {
    UUID id = UUID.randomUUID();
    String xml = "<document><title>World!</title></document>";

    documentWriteRepository.insert(id, XmlUtils.parseUnchecked(xml), user);

    assertThrows(DataIntegrityViolationException.class, () -> {
      documentWriteRepository.insert(id, XmlUtils.parseUnchecked(xml), user);
    });
  }

  @Test
  void shouldUpdateAndGetDocument() {
    UUID id = UUID.randomUUID();
    String xml = "<document><title>World!</title></document>";

    documentWriteRepository.insert(id, XmlUtils.parseUnchecked(xml), user);

    assertEquals("World!", documentReadRepository.value(DocumentCriteria.byId(id), user)
        .map(v -> v.value)
        .orElseThrow(AssertionError::new)
        .getElementsByTagName("title")
        .item(0)
        .getTextContent());

    documentWriteRepository
        .update(id, XmlUtils.parseUnchecked("<document><title>World!!</title></document>"), user);

    assertEquals("World!!", documentReadRepository.value(DocumentCriteria.byId(id), user)
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

    documentWriteRepository.insert(id, XmlUtils.parseUnchecked(xml), user);

    assertEquals(1, documentReadRepository.count(DocumentCriteria.byId(id), user));

    documentWriteRepository.delete(id, user);

    assertEquals(0, documentReadRepository.count(DocumentCriteria.byId(id), user));
  }

}
