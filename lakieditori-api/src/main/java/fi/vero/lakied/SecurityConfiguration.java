package fi.vero.lakied;

import fi.vero.lakied.service.user.UserCriteria;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.security.User;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
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

    private final ReadRepository<UUID, User> userReadRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public WebSecurityConfiguration(
        ReadRepository<UUID, User> userReadRepository,
        PasswordEncoder passwordEncoder) {
      this.userReadRepository = userReadRepository;
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
      UserDetailsService userDetailsService = username -> userReadRepository
          .value(
              UserCriteria.byUsername(username),
              User.superuser("userDetailsService"))
          .orElseThrow(() -> new UsernameNotFoundException(""));

      auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder);
    }

  }

}
