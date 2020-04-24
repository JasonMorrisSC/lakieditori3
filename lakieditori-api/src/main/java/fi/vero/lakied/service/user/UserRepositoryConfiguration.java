package fi.vero.lakied.service.user;

import static fi.vero.lakied.util.security.PermissionEvaluator.permitAuthenticated;
import static fi.vero.lakied.util.security.PermissionEvaluator.permitRead;
import static fi.vero.lakied.util.security.PermissionEvaluator.permitSuperuser;

import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.jdbc.TransactionalJdbcWriteRepository;
import fi.vero.lakied.util.security.EntryAuthorizingReadRepository;
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
        new UserReadRepository(
            new EntryAuthorizingReadRepository<>(
                new JdbcUserReadRepository(ds),
                userReadPermissionEvaluator()),
            new KeyAuthorizingReadRepository<>(
                new JdbcUserPropertiesReadRepository(ds),
                userPropertyReadPermissionEvaluator()));
  }

  @Bean
  public WriteRepository<UUID, User> userWriteRepository(DataSource ds,
      PlatformTransactionManager txm) {
    return
        new KeyAuthorizingWriteRepository<>(
            new TransactionalJdbcWriteRepository<>(
                new UserWriteRepository(
                    new JdbcUserWriteRepository(ds),
                    new JdbcUserPropertiesReadRepository(ds),
                    new JdbcUserPropertiesWriteRepository(ds)),
                txm),
            PermissionEvaluator.permitSuperuser());
  }

  private PermissionEvaluator<Tuple2<UUID, User>> userReadPermissionEvaluator() {
    PermissionEvaluator<Tuple2<UUID, User>> superuser = permitSuperuser();
    PermissionEvaluator<Tuple2<UUID, User>> authenticated = permitAuthenticated();
    PermissionEvaluator<Tuple2<UUID, User>> read = permitRead();
    PermissionEvaluator<Tuple2<UUID, User>> userObjectIsEnabled = (u, o, p) -> o._2.isEnabled();

    return superuser.or(
        authenticated
            .and(read)
            .and(userObjectIsEnabled));
  }

  private PermissionEvaluator<Tuple2<UUID, String>> userPropertyReadPermissionEvaluator() {
    PermissionEvaluator<Tuple2<UUID, String>> superuser = permitSuperuser();
    PermissionEvaluator<Tuple2<UUID, String>> authenticated = permitAuthenticated();
    PermissionEvaluator<Tuple2<UUID, String>> read = permitRead();
    PermissionEvaluator<Tuple2<UUID, String>> self = (u, o, p) -> u.getId().equals(o._1);

    return superuser.or(
        authenticated
            .and(read)
            .and(self));
  }

}
