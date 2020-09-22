package fi.vero.lakied;

import static com.google.common.base.Strings.nullToEmpty;
import static org.apache.http.HttpStatus.SC_FORBIDDEN;
import static org.apache.http.HttpStatus.SC_NO_CONTENT;
import static org.apache.http.HttpStatus.SC_UNAUTHORIZED;

import fi.vero.lakied.repository.user.UserCriteria;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.security.AuthenticationEventPrinter;
import fi.vero.lakied.util.security.User;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.event.AbstractAuthenticationEvent;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

@EnableWebSecurity
public class SecurityConfiguration {

  private static final Logger log = LoggerFactory.getLogger(SecurityConfiguration.class);

  private final ReadRepository<UUID, User> userReadRepository;

  @Autowired
  public SecurityConfiguration(ReadRepository<UUID, User> userReadRepository) {
    this.userReadRepository = userReadRepository;
  }

  @EventListener
  public void logAuthenticationEvent(AbstractAuthenticationEvent event) {
    log.info(AuthenticationEventPrinter.prettyPrint(event));
  }

  @Bean
  public UserDetailsService userDetailsService() {
    return username -> userReadRepository
        .value(UserCriteria.byUsername(username), User.superuser("userDetailsService"))
        .orElseThrow(() -> new UsernameNotFoundException(""));
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Configuration
  @Order(1)
  public static class HttpBasicAuthenticationConfiguration extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
      http
          .requestMatcher(req -> nullToEmpty(req.getHeader("Authorization")).startsWith("Basic"))
          .csrf().disable()
          .httpBasic();
    }

  }

  @Configuration
  @Order(2)
  public static class SessionAuthenticationConfiguration extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
      http
          .csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
          .and()
          .formLogin()
          .loginProcessingUrl("/api/login")
          .successHandler((req, res, auth) -> res.setStatus(SC_NO_CONTENT))
          .failureHandler((req, res, e) -> res.sendError(SC_UNAUTHORIZED))
          .and()
          .logout()
          .logoutUrl("/api/logout")
          .logoutSuccessHandler((req, res, e) -> res.setStatus(SC_NO_CONTENT))
          .and()
          .exceptionHandling()
          .authenticationEntryPoint(new Http403ForbiddenEntryPoint())
          .accessDeniedHandler((req, res, ex) -> res.sendError(SC_FORBIDDEN));
    }

  }

}
