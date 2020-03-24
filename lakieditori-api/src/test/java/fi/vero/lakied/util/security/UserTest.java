package fi.vero.lakied.util.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

class UserTest {

  @Test
  void shouldBuildUser() {
    UUID id = UUID.randomUUID();

    User user = User.builder()
        .id(id)
        .username("username")
        .password("password")
        .firstName("First")
        .lastName("Last")
        .superuser(true)
        .enabled(true)
        .build();

    assertEquals(id, user.getId());
    assertEquals("username", user.getUsername());
    assertEquals("password", user.getPassword());
    assertEquals("First", user.getFirstName().orElse(null));
    assertEquals("Last", user.getLastName().orElse(null));
    assertTrue(user.isSuperuser());
    assertTrue(user.isEnabled());
  }

  @Test
  void shouldConvertUserToDocumentAndBack() {
    User user = User.builder()
        .randomId()
        .username("username")
        .password("password")
        .firstName("First")
        .lastName("Last")
        .enabled(true)
        .superuser(true)
        .build();

    assertEquals(
        user,
        User.fromDocument(user.toDocument(true), new PasswordEncoder() {
          @Override
          public String encode(CharSequence rawPassword) {
            return rawPassword.toString();
          }

          @Override
          public boolean matches(CharSequence rawPassword, String encodedPassword) {
            return rawPassword.toString().equals(encodedPassword);
          }
        }));
  }

}