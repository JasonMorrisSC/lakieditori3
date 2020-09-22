package fi.vero.lakied.repository.user;

import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.criteria.Criteria;
import fi.vero.lakied.util.security.User;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class UserReadRepository implements ReadRepository<UUID, User> {

  private final ReadRepository<UUID, User> userReadRepository;
  private final ReadRepository<Tuple2<UUID, String>, String> userPropertiesReadRepository;

  public UserReadRepository(
      ReadRepository<UUID, User> userReadRepository,
      ReadRepository<Tuple2<UUID, String>, String> userPropertiesReadRepository) {
    this.userReadRepository = userReadRepository;
    this.userPropertiesReadRepository = userPropertiesReadRepository;
  }

  @Override
  public Stream<Tuple2<UUID, User>> entries(Criteria<UUID, User> criteria, User principal) {
    return userReadRepository.entries(criteria, principal)
        .map(t -> {
          UUID id = t._1;
          User user = t._2;

          User userWithProperties = User.builderFrom(user)
              .properties(properties(id, principal))
              .build();

          return Tuple.of(id, userWithProperties);
        });
  }

  private Map<String, String> properties(UUID userId, User principal) {
    try (Stream<Tuple2<Tuple2<UUID, String>, String>> entries = userPropertiesReadRepository
        .entries(UserPropertiesCriteria.byUserId(userId), principal)) {
      return entries.collect(Collectors.toMap(
          e -> e._1._2,
          e -> e._2));
    }
  }

}
