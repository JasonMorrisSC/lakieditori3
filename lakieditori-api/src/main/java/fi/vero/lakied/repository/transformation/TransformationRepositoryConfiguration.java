package fi.vero.lakied.repository.transformation;

import static fi.vero.lakied.util.security.PermissionEvaluator.permitAuthenticated;

import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.security.KeyAuthorizingReadRepository;
import javax.sql.DataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.w3c.dom.Document;

@Configuration
public class TransformationRepositoryConfiguration {

  @Bean
  public ReadRepository<String, Document> transformationReadRepository(DataSource ds) {
    return
        new KeyAuthorizingReadRepository<>(
            new JdbcTransformationReadRepository(ds),
            permitAuthenticated());
  }

}
