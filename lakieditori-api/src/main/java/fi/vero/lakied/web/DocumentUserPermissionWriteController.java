package fi.vero.lakied.web;

import com.google.common.collect.Sets;
import fi.vero.lakied.service.document.DocumentUserPermissionCriteria;
import fi.vero.lakied.util.common.Empty;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.common.Tuple3;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.security.Permission;
import fi.vero.lakied.util.security.User;
import fi.vero.lakied.util.xml.PostXmlMapping;
import fi.vero.lakied.util.xml.XmlUtils;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.w3c.dom.Document;

@RestController
@RequestMapping("/api/documents/{documentId}/permissions")
public class DocumentUserPermissionWriteController {

  private final Logger log = LoggerFactory.getLogger(getClass());

  private final ReadRepository<Tuple3<UUID, String, Permission>, Empty> documentUserPermissionReadRepository;
  private final WriteRepository<Tuple3<UUID, String, Permission>, Empty> documentUserPermissionWriteRepository;

  @Autowired
  public DocumentUserPermissionWriteController(
      ReadRepository<Tuple3<UUID, String, Permission>, Empty> documentUserPermissionReadRepository,
      WriteRepository<Tuple3<UUID, String, Permission>, Empty> documentUserPermissionWriteRepository) {
    this.documentUserPermissionReadRepository = documentUserPermissionReadRepository;
    this.documentUserPermissionWriteRepository = documentUserPermissionWriteRepository;
  }

  @PostXmlMapping
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void post(
      @PathVariable("documentId") UUID documentId,
      @RequestBody Document permissions,
      @AuthenticationPrincipal User user) {

    Set<Tuple3<UUID, String, Permission>> newPermissionSet =
        XmlUtils.queryNodes(permissions, "/permissions/permission")
            .flatMap(permission -> {
              String username = XmlUtils.queryText(permission, "@username");
              return Stream.of(XmlUtils.queryText(permission, "@value").split(","))
                  .filter(s -> !s.isEmpty())
                  .map(Permission::valueOf)
                  .map(value -> Tuple.of(documentId, username, value));
            })
            .collect(Collectors.toSet());

    Set<Tuple3<UUID, String, Permission>> oldPermissionSet;
    try (Stream<Tuple2<Tuple3<UUID, String, Permission>, Empty>> entries =
        documentUserPermissionReadRepository.entries(
            DocumentUserPermissionCriteria.byDocumentId(documentId),
            User.superuser("permissionReader"))) {
      oldPermissionSet = entries.map(e -> e._1).collect(Collectors.toSet());
    }

    for (Tuple3<UUID, String, Permission> removed : Sets
        .difference(oldPermissionSet, newPermissionSet)) {
      documentUserPermissionWriteRepository.delete(removed, user);
    }
    for (Tuple3<UUID, String, Permission> inserted : Sets
        .difference(newPermissionSet, oldPermissionSet)) {
      documentUserPermissionWriteRepository.insert(inserted, Empty.INSTANCE, user);
    }

  }

}
