package fi.vero.lakied.web;

import fi.vero.lakied.util.common.UUIDs;
import fi.vero.lakied.util.security.User;
import fi.vero.lakied.util.xml.GetXmlMapping;
import fi.vero.lakied.util.xml.XmlDocumentBuilder;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.w3c.dom.Document;

@RestController
@RequestMapping("/api")
public class WhoAmIController {

  private final Document nullUser = XmlDocumentBuilder.builder()
      .pushElement("user")
      .attribute("id", UUIDs.nilUuid().toString())
      .build();

  @GetXmlMapping("/whoami")
  public Document get(@AuthenticationPrincipal User principal) {
    return principal != null
        ? principal.toDocument()
        : nullUser;
  }

}
