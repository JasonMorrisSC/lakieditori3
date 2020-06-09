package fi.vero.lakied.util.security;

import static fi.vero.lakied.util.common.BooleanUtils.parseWithDefaultTrue;
import static fi.vero.lakied.util.xml.XmlUtils.queryNodes;
import static fi.vero.lakied.util.xml.XmlUtils.queryText;
import static java.lang.Boolean.parseBoolean;

import com.google.common.base.MoreObjects;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import fi.vero.lakied.util.xml.XmlDocumentBuilder;
import fi.vero.lakied.util.xml.XmlUtils;
import java.util.Collection;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;

public final class User implements UserDetails {

  private final UUID id;

  private final String username;
  private final String password;

  private final String firstName;
  private final String lastName;

  private final boolean superuser;
  private final boolean enabled;

  private final ImmutableMap<String, String> properties;

  private User(
      UUID id,
      String username,
      String password,
      String firstName,
      String lastName,
      boolean superuser,
      boolean enabled,
      Map<String, String> properties) {
    this.id = Objects.requireNonNull(id);
    this.username = Objects.requireNonNull(username);
    this.password = Objects.requireNonNull(password);
    this.firstName = firstName;
    this.lastName = lastName;
    this.enabled = enabled;
    this.superuser = superuser;
    this.properties = properties != null
        ? ImmutableMap.copyOf(properties)
        : ImmutableMap.of();
  }

  public static IdBuilder builder() {
    return new IdBuilder();
  }

  public static UserBuilder builderFrom(User user) {
    return builder()
        .id(user.id)
        .username(user.username)
        .password(user.password)
        .firstName(user.firstName)
        .lastName(user.lastName)
        .enabled(user.enabled)
        .superuser(user.superuser)
        .properties(user.properties);
  }

  public static User superuser(String username, String password) {
    return new User(UUID.randomUUID(), username, password, null, null, true, true,
        ImmutableMap.of());
  }

  public static User superuser(String username) {
    return new User(UUID.randomUUID(), username, "", null, null, true, true, ImmutableMap.of());
  }

  public static User fromDocument(Document document, PasswordEncoder passwordEncoder) {
    return fromDocument(
        UUID.fromString(queryText(document, "/user/@id")),
        document,
        passwordEncoder);
  }

  public static User fromDocument(UUID id, Document document, PasswordEncoder passwordEncoder) {
    return User.builder()
        .id(id)
        .username(queryText(document, "/user/username"))
        .password(queryText(document, "/user/password").isEmpty()
            ? "" : passwordEncoder.encode(queryText(document, "/user/password")))
        .firstName(queryText(document, "/user/firstName"))
        .lastName(queryText(document, "/user/lastName"))
        .superuser(parseBoolean(queryText(document, "/user/superuser")))
        .enabled(parseWithDefaultTrue(queryText(document, "/user/enabled")))
        .properties(queryNodes(document, "/user/properties/property")
            .filter(XmlUtils::isElementNode)
            .map(node -> (Element) node)
            .collect(Collectors.toMap(e -> e.getAttribute("key"), Node::getTextContent)))
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

  public ImmutableMap<String, String> getProperties() {
    return properties;
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

    builder
        .pushElement("firstName").text(firstName).pop()
        .pushElement("lastName").text(lastName).pop()
        .pushElement("superuser").text(String.valueOf(isSuperuser())).pop()
        .pushElement("enabled").text(String.valueOf(isEnabled())).pop();

    builder.pushElement("properties");
    properties.forEach((key, value) -> {
      builder.pushElement("property");
      builder.attribute("key", key);
      builder.text(value);
      builder.pop();
    });
    builder.pop();

    return builder.build();
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

    public UserBuilder randomPassword() {
      return new UserBuilder(id, username, UUID.randomUUID().toString());
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

    private Map<String, String> properties;

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

    public UserBuilder properties(Map<String, String> properties) {
      this.properties = properties;
      return this;
    }

    public User build() {
      return new User(
          id,
          username, password, firstName,
          lastName,
          superuser,
          enabled,
          properties);
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
        Objects.equals(password, user.password) &&
        Objects.equals(properties, user.properties);
  }

  @Override
  public int hashCode() {
    return Objects
        .hash(id, firstName, lastName, username, password, superuser, enabled, properties);
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
        .add("properties", properties)
        .toString();
  }
}
