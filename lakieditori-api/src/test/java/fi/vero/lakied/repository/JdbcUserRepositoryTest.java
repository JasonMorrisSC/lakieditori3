package fi.vero.lakied.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.google.common.collect.ImmutableMap;
import fi.vero.lakied.repository.user.JdbcUserPropertiesReadRepository;
import fi.vero.lakied.repository.user.JdbcUserPropertiesWriteRepository;
import fi.vero.lakied.repository.user.JdbcUserReadRepository;
import fi.vero.lakied.repository.user.JdbcUserWriteRepository;
import fi.vero.lakied.repository.user.UserCriteria;
import fi.vero.lakied.repository.user.UserReadRepository;
import fi.vero.lakied.repository.user.UserWriteRepository;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.security.User;
import java.util.UUID;
import javax.sql.DataSource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@SpringBootTest
class JdbcUserRepositoryTest {

  @Autowired
  private DataSource dataSource;

  private ReadRepository<UUID, User> userReadRepository;
  private WriteRepository<UUID, User> userWriteRepository;

  @BeforeEach
  void setUp() {
    this.userReadRepository = new UserReadRepository(
        new JdbcUserReadRepository(dataSource),
        new JdbcUserPropertiesReadRepository(dataSource));

    this.userWriteRepository = new UserWriteRepository(
        new JdbcUserWriteRepository(dataSource),
        new JdbcUserPropertiesReadRepository(dataSource),
        new JdbcUserPropertiesWriteRepository(dataSource));
  }

  @Test
  void shouldInsertNewUser() {
    UUID id = UUID.randomUUID();
    User user = User.builder()
        .id(id)
        .username("test")
        .password("pass")
        .firstName("Test")
        .lastName("User")
        .enabled(true)
        .superuser(false)
        .properties(ImmutableMap.of(
            "examplePropertyKey1", "Foo",
            "examplePropertyKey2", "Bar"))
        .build();

    userWriteRepository.insert(id, user, null);

    User storedUser = userReadRepository.value(UserCriteria.byId(id), null)
        .orElseThrow(AssertionError::new);

    assertEquals(user, storedUser);
  }

  @Test
  void shouldUpdateUser() {
    UUID id = UUID.randomUUID();
    User user = User.builder()
        .id(id)
        .username("test")
        .password("pass")
        .firstName("Test")
        .lastName("User")
        .enabled(true)
        .superuser(false)
        .properties(ImmutableMap.of(
            "examplePropertyKey1", "Foo",
            "examplePropertyKey2", "Bar"))
        .build();

    userWriteRepository.insert(id, user, null);

    User updatedUser = User.builderFrom(user)
        .firstName("TestUpdated")
        .superuser(true)
        .properties(ImmutableMap.of(
            "examplePropertyKey1", "FooFoo",
            "examplePropertyKey3", "Bar"))
        .build();

    userWriteRepository.update(id, updatedUser, null);

    User storedUpdatedUser = userReadRepository.value(UserCriteria.byId(id), null)
        .orElseThrow(AssertionError::new);

    assertNotEquals(user, storedUpdatedUser);
    assertEquals(updatedUser, storedUpdatedUser);
  }

  @Test
  void shouldDeleteUser() {
    UUID id = UUID.randomUUID();
    User user = User.builder()
        .id(id)
        .username("test")
        .password("pass")
        .firstName("Test")
        .lastName("User")
        .enabled(true)
        .superuser(false)
        .properties(ImmutableMap.of(
            "examplePropertyKey1", "Foo",
            "examplePropertyKey2", "Bar"))
        .build();

    userWriteRepository.insert(id, user, null);

    assertTrue(userReadRepository.value(UserCriteria.byId(id), null).isPresent());

    userWriteRepository.delete(id, null);

    assertFalse(userReadRepository.value(UserCriteria.byId(id), null).isPresent());
  }

}
