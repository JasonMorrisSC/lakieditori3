package fi.vero.lakied.util.security;

import com.google.common.collect.ImmutableList;
import fi.vero.lakied.util.xml.XmlDocumentBuilder;
import java.util.Collection;
import java.util.UUID;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.w3c.dom.Document;

public class User implements UserDetails {

  private final UUID id;
  private final String username;
  private final String password;
  private final boolean superuser;
  private final boolean enabled;

  private User(
      UUID id,
      String username,
      String password,
      boolean superuser,
      boolean enabled) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.enabled = enabled;
    this.superuser = superuser;
  }

  public static User of(
      UUID id,
      String username,
      String password,
      boolean superuser,
      boolean enabled) {
    return new User(id, username, password, superuser, enabled);
  }

  public static User superuser(String username, String password) {
    return new User(UUID.randomUUID(), username, password, true, true);
  }

  public static User superuser(String username) {
    return new User(UUID.randomUUID(), username, "", true, true);
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

  @Override
  public Collection<GrantedAuthority> getAuthorities() {
    return ImmutableList.of();
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
    return XmlDocumentBuilder.builder()
        .pushElement("user").attribute("id", id.toString())
        .pushElement("username").text(username).pop()
        .pushElement("superuser").text(String.valueOf(isSuperuser())).pop()
        .pushElement("enabled").text(String.valueOf(isEnabled())).pop()
        .build();
  }

}
