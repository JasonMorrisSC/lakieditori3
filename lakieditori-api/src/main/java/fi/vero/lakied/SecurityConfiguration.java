package fi.vero.lakied;

import static org.apache.http.HttpStatus.SC_FORBIDDEN;
import static org.apache.http.HttpStatus.SC_NO_CONTENT;
import static org.apache.http.HttpStatus.SC_UNAUTHORIZED;

import fi.vero.lakied.service.user.UserCriteria;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.security.HttpBasicRequestMatcher;
import fi.vero.lakied.util.security.User;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

@Configuration
public class SecurityConfiguration {

  private static final Logger log = LoggerFactory.getLogger(SecurityConfiguration.class);

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
      http
          .requestMatchers(configurer ->
              configurer.requestMatchers(new HttpBasicRequestMatcher(true)))
          .csrf().disable()
          .httpBasic();

      http
          .requestMatchers(configurer ->
              configurer.requestMatchers(new HttpBasicRequestMatcher(false)))
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
