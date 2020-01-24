package fi.vero.lakied.service.user;

import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.User;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.jdbc.TransactionalJdbcWriteRepository;
import javax.sql.DataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
public class UserRepositoryConfiguration {

  @Bean
  public ReadRepository<String, User> userReadRepository(DataSource ds) {
    return new JdbcUserReadRepository(ds);
  }

  @Bean
  public WriteRepository<String, User> userWriteRepository(DataSource ds,
      PlatformTransactionManager txm) {
    return new TransactionalJdbcWriteRepository<>(new JdbcUserWriteRepository(ds), txm);
  }

}
