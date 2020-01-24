package fi.vero.lakied;

import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.User;
import fi.vero.lakied.util.criteria.Criteria;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfiguration {

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @EnableWebSecurity
  public static class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {

    private final ReadRepository<String, User> userRepository;
    private final PasswordEncoder passwordEncoder;

    public WebSecurityConfiguration(
        ReadRepository<String, User> userRepository,
        PasswordEncoder passwordEncoder) {
      this.userRepository = userRepository;
      this.passwordEncoder = passwordEncoder;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
      http.csrf().disable();

      http.headers().frameOptions().sameOrigin();

      http.authorizeRequests()
          .anyRequest()
          .authenticated();

      http.httpBasic();
    }

    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
      UserDetailsService userDetailsService = username -> userRepository
          .value(
              Criteria.withSql((k, v) -> k.equals(username), "username = ?", username),
              User.of("userDetailsService"))
          .orElseThrow(() -> new UsernameNotFoundException(""));

      auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder);
    }

  }

}
