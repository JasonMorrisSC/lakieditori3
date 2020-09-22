package fi.vero.lakied.web;

import fi.vero.lakied.repository.document.DocumentUserPermissionCriteria;
import fi.vero.lakied.util.common.Empty;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.common.Tuple4;
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
@RequestMapping("/api/schemas/{schemaName}/documents/{id}/permissions")
public class DocumentUserPermissionReadController {

  private final ReadRepository<Tuple4<String, UUID, String, Permission>, Empty> documentUserPermissionReadRepository;

  @Autowired
  public DocumentUserPermissionReadController(
      ReadRepository<Tuple4<String, UUID, String, Permission>, Empty> documentUserPermissionReadRepository) {
    this.documentUserPermissionReadRepository = documentUserPermissionReadRepository;
  }

  @GetXmlMapping
  public Document get(
      @PathVariable("schemaName") String schemaName,
      @PathVariable("id") UUID id,
      @AuthenticationPrincipal User user) {
    XmlDocumentBuilder builder = XmlDocumentBuilder.builder();
    builder.pushElement("permissions");

    try (Stream<Tuple2<Tuple4<String, UUID, String, Permission>, Empty>> entries =
        documentUserPermissionReadRepository.entries(
            DocumentUserPermissionCriteria.byDocumentKey(schemaName, id), user)) {

      Map<String, String> permissionsByUsername = entries
          // keep only username and permission
          .map(e -> Tuple.of(e._1._3, e._1._4))
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
