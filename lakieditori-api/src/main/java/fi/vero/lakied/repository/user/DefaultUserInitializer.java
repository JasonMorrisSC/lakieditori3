package fi.vero.lakied.repository.user;

import static fi.vero.lakied.util.criteria.Criteria.matchAll;

import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.security.User;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Saves a new default user if none is found.
 * <p>
 * Uses Spring security property values:
 * <ul>
 * <li>spring.security.user.name</li>
 * <li>spring.security.user.password</li>
 * </ul>
 */
@Component
public class DefaultUserInitializer implements ApplicationListener<ContextRefreshedEvent> {

  private final Logger log = LoggerFactory.getLogger(getClass());

  private final SecurityProperties securityProperties;
  private final PasswordEncoder passwordEncoder;

  private final ReadRepository<UUID, User> userReadRepository;
  private final WriteRepository<UUID, User> userWriteRepository;

  private final User initializer = User.superuser("defaultUserInitializer");

  public DefaultUserInitializer(
      SecurityProperties securityProperties,
      PasswordEncoder passwordEncoder,
      ReadRepository<UUID, User> userReadRepository,
      WriteRepository<UUID, User> userWriteRepository) {
    this.securityProperties = securityProperties;
    this.passwordEncoder = passwordEncoder;
    this.userReadRepository = userReadRepository;
    this.userWriteRepository = userWriteRepository;
  }

  @Override
  public void onApplicationEvent(ContextRefreshedEvent e) {
    if (userReadRepository.count(matchAll(), initializer) == 0) {
      SecurityProperties.User defaultUser = securityProperties.getUser();

      userWriteRepository.insert(
          UUID.randomUUID(),
          User.superuser(defaultUser.getName(), passwordEncoder.encode(defaultUser.getPassword())),
          initializer);

      log.info("Saved default user: {} / {}", defaultUser.getName(), defaultUser.getPassword());
    }
  }

}
