package fi.vero.lakied.service.user;

import static fi.vero.lakied.util.security.PermissionEvaluator.permitAuthenticated;
import static fi.vero.lakied.util.security.PermissionEvaluator.permitRead;
import static fi.vero.lakied.util.security.PermissionEvaluator.permitSuperuser;

import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.jdbc.TransactionalJdbcWriteRepository;
import fi.vero.lakied.util.security.EntryAuthorizingReadRepository;
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
        new EntryAuthorizingReadRepository<>(
            new JdbcUserReadRepository(ds),
            userEntryReadPermissionEvaluator());
  }

  @Bean
  public WriteRepository<UUID, User> userWriteRepository(DataSource ds,
      PlatformTransactionManager txm) {
    return
        new KeyAuthorizingWriteRepository<>(
            new TransactionalJdbcWriteRepository<>(new JdbcUserWriteRepository(ds), txm),
            PermissionEvaluator.permitSuperuser());
  }

  private PermissionEvaluator<Tuple2<UUID, User>> userEntryReadPermissionEvaluator() {
    PermissionEvaluator<Tuple2<UUID, User>> superuser = permitSuperuser();
    PermissionEvaluator<Tuple2<UUID, User>> authenticated = permitAuthenticated();
    PermissionEvaluator<Tuple2<UUID, User>> read = permitRead();
    PermissionEvaluator<Tuple2<UUID, User>> userObjectIsEnabled = (u, o, p) -> o._2.isEnabled();

    return superuser.or(
        authenticated
            .and(read)
            .and(userObjectIsEnabled));
  }

}
