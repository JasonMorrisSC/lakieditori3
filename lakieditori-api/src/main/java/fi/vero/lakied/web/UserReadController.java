package fi.vero.lakied.web;

import fi.vero.lakied.service.user.UserCriteria;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.exception.NotFoundException;
import fi.vero.lakied.util.security.User;
import fi.vero.lakied.util.xml.GetXmlMapping;
import fi.vero.lakied.util.xml.XmlDocumentBuilder;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.w3c.dom.Document;

@RestController
@RequestMapping("/api/users")
public class UserReadController {

  private final ReadRepository<UUID, User> userReadRepository;

  @Autowired
  public UserReadController(ReadRepository<UUID, User> userReadRepository) {
    this.userReadRepository = userReadRepository;
  }

  @GetXmlMapping("/{id}")
  public Document get(
      @PathVariable("id") UUID id,
      @AuthenticationPrincipal User principal) {
    return userReadRepository.value(UserCriteria.byId(id), principal)
        .map(User::toDocument)
        .orElseThrow(NotFoundException::new);
  }

  @GetXmlMapping
  public Document getAll(
      @RequestParam(name = "enabled", defaultValue = "true") boolean enabled,
      @AuthenticationPrincipal User principal) {
    XmlDocumentBuilder builder = XmlDocumentBuilder.builder().pushElement("users");

    userReadRepository.forEachEntry(
        UserCriteria.isEnabled(enabled),
        principal,
        (id, user) -> builder.pushExternal(user.toDocument()).pop());

    return builder.build();
  }

}
