package fi.vero.lakied.util.security;

import static com.google.common.base.Strings.nullToEmpty;

import javax.servlet.http.HttpServletRequest;
import org.springframework.security.web.util.matcher.RequestMatcher;

public class HttpBasicRequestMatcher implements RequestMatcher {

  private final boolean shouldUseBasicAuth;

  public HttpBasicRequestMatcher(boolean shouldUseBasicAuth) {
    this.shouldUseBasicAuth = shouldUseBasicAuth;
  }

  @Override
  public boolean matches(HttpServletRequest req) {
    return nullToEmpty(req.getHeader("Authorization")).startsWith("Basic") == shouldUseBasicAuth;
  }

}
