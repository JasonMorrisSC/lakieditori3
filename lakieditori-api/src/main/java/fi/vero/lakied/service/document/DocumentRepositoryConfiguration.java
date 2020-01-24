package fi.vero.lakied.service.document;

import static fi.vero.lakied.util.common.ResourceUtils.resourceToString;

import fi.vero.lakied.util.common.Audited;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.jdbc.TransactionalJdbcWriteRepository;
import fi.vero.lakied.util.xml.XmlUtils;
import javax.sql.DataSource;
import javax.xml.validation.Schema;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;
import org.w3c.dom.Document;

@Configuration
public class DocumentRepositoryConfiguration {

  @Bean
  public ReadRepository<String, Audited<Document>> documentReadRepository(DataSource ds) {
    return new JdbcDocumentReadRepository(ds);
  }

  @Bean
  public Schema documentSchema() {
    return XmlUtils.parseSchema(resourceToString("schemas/document.xsd"));
  }

  @Bean
  public WriteRepository<String, Document> documentWriteRepository(
      PlatformTransactionManager txm,
      DataSource ds) {
    return
        new ValidatingDocumentWriteRepository(
            new TransactionalJdbcWriteRepository<>(
                new JdbcDocumentWriteRepository(ds), txm),
            documentSchema());
  }

}
