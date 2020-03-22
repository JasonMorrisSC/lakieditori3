package fi.vero.lakied.service.user;

import static fi.vero.lakied.util.security.PermissionEvaluator.permitRead;

import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.jdbc.TransactionalJdbcWriteRepository;
import fi.vero.lakied.util.security.KeyAuthorizingReadRepository;
import fi.vero.lakied.util.security.KeyAuthorizingWriteRepository;
import fi.vero.lakied.util.security.PermissionEvaluator;
import fi.vero.lakied.util.security.User;
import java.util.UUID;
import javax.sql.DataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
public class UserRepositoryConfiguration {

  @Bean
  public ReadRepository<UUID, User> userReadRepository(DataSource ds) {
    return
        new KeyAuthorizingReadRepository<>(
            new JdbcUserReadRepository(ds),
            userPermissionEvaluator());
  }

  @Bean
  public WriteRepository<UUID, User> userWriteRepository(DataSource ds,
      PlatformTransactionManager txm) {
    return
        new KeyAuthorizingWriteRepository<>(
            new TransactionalJdbcWriteRepository<>(new JdbcUserWriteRepository(ds), txm),
            userPermissionEvaluator());
  }

  private PermissionEvaluator<UUID> userPermissionEvaluator() {
    PermissionEvaluator<UUID> superuser = PermissionEvaluator.permitSuperuser();
    PermissionEvaluator<UUID> authenticated = PermissionEvaluator.permitAuthenticated();

    return superuser.or(authenticated.and(permitRead()));
  }

}
