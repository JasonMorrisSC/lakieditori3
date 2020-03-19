package fi.vero.lakied.web;

import fi.vero.lakied.util.common.BooleanUtils;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.security.User;
import fi.vero.lakied.util.xml.PostXmlMapping;
import fi.vero.lakied.util.xml.PutXmlMapping;
import fi.vero.lakied.util.xml.XmlUtils;
import java.util.UUID;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.w3c.dom.Document;

@RestController
@RequestMapping("/api/users")
public class UserWriteController {

  private final WriteRepository<UUID, User> userWriteRepository;
  private final PasswordEncoder passwordEncoder;

  @Autowired
  public UserWriteController(
      WriteRepository<UUID, User> userWriteRepository,
      PasswordEncoder passwordEncoder) {
    this.userWriteRepository = userWriteRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @PostXmlMapping
  @ResponseStatus(HttpStatus.CREATED)
  public void post(
      @RequestBody Document user,
      @AuthenticationPrincipal User principal,
      HttpServletResponse response) {
    UUID id = UUID.randomUUID();

    userWriteRepository.insert(id,
        User.of(
            id,
            XmlUtils.queryText(user, "/user/username"),
            passwordEncoder.encode(
                XmlUtils.queryText(user, "/user/password")),
            Boolean.parseBoolean(XmlUtils.queryText(user, "/user/superuser")),
            BooleanUtils.parseWithDefaultTrue(XmlUtils.queryText(user, "/user/enabled"))),
        principal);

    String resultUrl = "/api/users/" + id;
    response.setHeader(HttpHeaders.LOCATION, resultUrl);
    response.setHeader("Refresh", "0;url=" + resultUrl);
  }

  @PutXmlMapping(path = "/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void put(
      @PathVariable("id") UUID id,
      @RequestBody Document user,
      @AuthenticationPrincipal User principal) {
    userWriteRepository.update(id,
        User.of(
            id,
            XmlUtils.queryText(user, "/user/username"),
            passwordEncoder.encode(
                XmlUtils.queryText(user, "/user/password")),
            Boolean.parseBoolean(XmlUtils.queryText(user, "/user/superuser")),
            BooleanUtils.parseWithDefaultTrue(XmlUtils.queryText(user, "/user/enabled"))),
        principal);
  }

}
