package fi.vero.lakied.util.security;

import com.google.common.base.CaseFormat;
import com.google.common.base.Converter;
import org.springframework.security.authentication.event.AbstractAuthenticationEvent;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetails;

public final class AuthenticationEventPrinter {

  private static final Converter<String, String> classNameToConstantName =
      CaseFormat.UPPER_CAMEL.converterTo(CaseFormat.UPPER_UNDERSCORE);

  private AuthenticationEventPrinter() {
  }

  public static String prettyPrint(AbstractAuthenticationEvent e) {
    String type = classNameToConstantName.convert(
        e.getClass().getSimpleName().replace("Event", ""));

    Authentication authentication = e.getAuthentication();

    Object principal = authentication.getPrincipal();
    if (principal instanceof UserDetails) {
      principal = ((UserDetails) principal).getUsername();
    }

    Object details = authentication.getDetails();
    if (details instanceof WebAuthenticationDetails) {
      details = ((WebAuthenticationDetails) details).getRemoteAddress();
    }

    return type + " " + principal + " " + details;
  }

}
