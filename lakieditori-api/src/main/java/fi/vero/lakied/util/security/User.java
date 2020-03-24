package fi.vero.lakied.util.security;

import com.google.common.base.MoreObjects;
import com.google.common.collect.ImmutableList;
import fi.vero.lakied.util.common.BooleanUtils;
import fi.vero.lakied.util.xml.XmlDocumentBuilder;
import fi.vero.lakied.util.xml.XmlUtils;
import java.util.Collection;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.w3c.dom.Document;

public final class User implements UserDetails {

  private final UUID id;

  private final String username;
  private final String password;

  private final String firstName;
  private final String lastName;

  private final boolean superuser;
  private final boolean enabled;

  private User(
      UUID id,
      String username,
      String password,
      String firstName,
      String lastName,
      boolean superuser,
      boolean enabled) {
    this.id = Objects.requireNonNull(id);
    this.username = Objects.requireNonNull(username);
    this.password = Objects.requireNonNull(password);
    this.firstName = firstName;
    this.lastName = lastName;
    this.enabled = enabled;
    this.superuser = superuser;
  }

  public static IdBuilder builder() {
    return new IdBuilder();
  }

  public static User superuser(String username, String password) {
    return new User(UUID.randomUUID(), username, password, null, null, true, true);
  }

  public static User superuser(String username) {
    return new User(UUID.randomUUID(), username, "", null, null, true, true);
  }

  public static User fromDocument(Document document, PasswordEncoder passwordEncoder) {
    return fromDocument(
        UUID.fromString(XmlUtils.queryText(document, "/user/@id")),
        document,
        passwordEncoder);
  }

  public static User fromDocument(UUID id, Document document, PasswordEncoder passwordEncoder) {
    return User.builder()
        .id(id)
        .username(XmlUtils.queryText(document, "/user/username"))
        .password(passwordEncoder.encode(XmlUtils.queryText(document, "/user/password")))
        .firstName(XmlUtils.queryText(document, "/user/firstName"))
        .lastName(XmlUtils.queryText(document, "/user/lastName"))
        .superuser(Boolean.parseBoolean(XmlUtils.queryText(document, "/user/superuser")))
        .enabled(BooleanUtils.parseWithDefaultTrue(XmlUtils.queryText(document, "/user/enabled")))
        .build();
  }

  public UUID getId() {
    return id;
  }

  @Override
  public String getUsername() {
    return username;
  }

  @Override
  public String getPassword() {
    return password;
  }

  public Optional<String> getFirstName() {
    return Optional.ofNullable(firstName);
  }

  public Optional<String> getLastName() {
    return Optional.ofNullable(lastName);
  }

  @Override
  public Collection<GrantedAuthority> getAuthorities() {
    return ImmutableList.of(new SimpleGrantedAuthority(superuser ? "SUPERUSER" : "USER"));
  }

  public boolean isSuperuser() {
    return superuser;
  }

  @Override
  public boolean isEnabled() {
    return enabled;
  }

  @Override
  public boolean isAccountNonExpired() {
    return isEnabled();
  }

  @Override
  public boolean isAccountNonLocked() {
    return isEnabled();
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return isEnabled();
  }


  public Document toDocument() {
    return toDocument(false);
  }

  public Document toDocument(boolean includePassword) {
    XmlDocumentBuilder builder = XmlDocumentBuilder.builder()
        .pushElement("user").attribute("id", id.toString())
        .pushElement("username").text(username).pop();

    if (includePassword) {
      builder.pushElement("password").text(password).pop();
    }

    return builder
        .pushElement("firstName").text(firstName).pop()
        .pushElement("lastName").text(lastName).pop()
        .pushElement("superuser").text(String.valueOf(isSuperuser())).pop()
        .pushElement("enabled").text(String.valueOf(isEnabled())).pop()
        .build();
  }

  public static final class IdBuilder {

    IdBuilder() {
    }

    public UsernameBuilder id(UUID id) {
      return new UsernameBuilder(Objects.requireNonNull(id));
    }

    public UsernameBuilder randomId() {
      return new UsernameBuilder(UUID.randomUUID());
    }
  }

  public static final class UsernameBuilder {

    private final UUID id;

    UsernameBuilder(UUID id) {
      this.id = id;
    }

    public PasswordBuilder username(String username) {
      return new PasswordBuilder(id, Objects.requireNonNull(username));
    }
  }

  public static final class PasswordBuilder {

    private final UUID id;
    private final String username;

    PasswordBuilder(UUID id, String username) {
      this.id = id;
      this.username = username;
    }

    public UserBuilder password(String password) {
      return new UserBuilder(id, username, Objects.requireNonNull(password));
    }
  }

  public static final class UserBuilder {

    private final UUID id;

    private final String username;
    private final String password;

    private String firstName;
    private String lastName;

    private boolean superuser;
    private boolean enabled;

    UserBuilder(UUID id, String username, String password) {
      this.id = id;
      this.username = username;
      this.password = password;
    }

    public UserBuilder firstName(String firstName) {
      this.firstName = firstName;
      return this;
    }

    public UserBuilder lastName(String lastName) {
      this.lastName = lastName;
      return this;
    }

    public UserBuilder superuser(boolean superuser) {
      this.superuser = superuser;
      return this;
    }

    public UserBuilder enabled(boolean enabled) {
      this.enabled = enabled;
      return this;
    }

    public User build() {
      return new User(
          id,
          username, password, firstName,
          lastName,
          superuser,
          enabled);
    }

  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    User user = (User) o;
    return superuser == user.superuser &&
        enabled == user.enabled &&
        Objects.equals(id, user.id) &&
        Objects.equals(firstName, user.firstName) &&
        Objects.equals(lastName, user.lastName) &&
        Objects.equals(username, user.username) &&
        Objects.equals(password, user.password);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, firstName, lastName, username, password, superuser, enabled);
  }

  @Override
  public String toString() {
    return MoreObjects.toStringHelper(this)
        .add("id", id)
        .add("username", username)
        .add("firstName", firstName)
        .add("lastName", lastName)
        .add("superuser", superuser)
        .add("enabled", enabled)
        .toString();
  }
}
