package fi.vero.lakied.web;

import fi.vero.lakied.service.document.DocumentUserPermissionCriteria;
import fi.vero.lakied.util.common.Empty;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.common.Tuple3;
import fi.vero.lakied.util.security.Permission;
import fi.vero.lakied.util.security.User;
import fi.vero.lakied.util.xml.GetXmlMapping;
import fi.vero.lakied.util.xml.XmlDocumentBuilder;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.w3c.dom.Document;

@RestController
@RequestMapping("/api/documents/{documentId}/permissions")
public class DocumentUserPermissionReadController {

  private final ReadRepository<Tuple3<UUID, String, Permission>, Empty> documentUserPermissionReadRepository;

  @Autowired
  public DocumentUserPermissionReadController(
      ReadRepository<Tuple3<UUID, String, Permission>, Empty> documentUserPermissionReadRepository) {
    this.documentUserPermissionReadRepository = documentUserPermissionReadRepository;
  }

  @GetXmlMapping
  public Document get(
      @PathVariable("documentId") UUID documentId,
      @AuthenticationPrincipal User user) {

    XmlDocumentBuilder builder = XmlDocumentBuilder.builder();
    builder.pushElement("permissions");

    try (Stream<Tuple2<Tuple3<UUID, String, Permission>, Empty>> entries =
        documentUserPermissionReadRepository.entries(
            DocumentUserPermissionCriteria.byDocumentId(documentId), user)) {

      Map<String, String> permissionsByUsername = entries
          // keep only username and permission
          .map(e -> Tuple.of(e._1._2, e._1._3))
          // group permissions by username
          .collect(
              Collectors.groupingBy(e -> e._1,
                  Collectors.mapping(e -> e._2.toString(), Collectors.joining(","))));

      permissionsByUsername.forEach((username, permissions) -> {
        builder.pushElement("permission")
            .attribute("username", username)
            .attribute("value", permissions);
        builder.pop();
      });
    }

    return builder.build();
  }

}
