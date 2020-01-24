package fi.vero.lakied.util.common;

import com.google.common.collect.ImmutableList;
import java.util.Collection;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class User implements UserDetails {

  private final String username;
  private final String password;
  private final boolean enabled;

  private User(String username, String password, boolean enabled) {
    this.username = username;
    this.password = password;
    this.enabled = enabled;
  }

  public static User of(String username, String password, boolean enabled) {
    return new User(username, password, enabled);
  }

  public static User of(String username, String password) {
    return new User(username, password, true);
  }

  public static User of(String username) {
    return new User(username, "", true);
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

}
