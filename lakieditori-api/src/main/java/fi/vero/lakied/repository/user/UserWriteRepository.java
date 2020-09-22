package fi.vero.lakied.repository.user;

import com.google.common.collect.MapDifference;
import com.google.common.collect.Maps;
import fi.vero.lakied.util.common.ReadRepository;
import fi.vero.lakied.util.common.Tuple;
import fi.vero.lakied.util.common.Tuple2;
import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.security.User;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class UserWriteRepository implements WriteRepository<UUID, User> {

  private final WriteRepository<UUID, User> userWriteRepository;
  private final ReadRepository<Tuple2<UUID, String>, String> userPropertiesReadRepository;
  private final WriteRepository<Tuple2<UUID, String>, String> userPropertiesWriteRepository;

  public UserWriteRepository(
      WriteRepository<UUID, User> userWriteRepository,
      ReadRepository<Tuple2<UUID, String>, String> userPropertiesReadRepository,
      WriteRepository<Tuple2<UUID, String>, String> userPropertiesWriteRepository) {
    this.userWriteRepository = userWriteRepository;
    this.userPropertiesReadRepository = userPropertiesReadRepository;
    this.userPropertiesWriteRepository = userPropertiesWriteRepository;
  }

  @Override
  public void insert(UUID id, User user, User principal) {
    userWriteRepository.insert(id, user, principal);

    user.getProperties().forEach((String key, String value) ->
        userPropertiesWriteRepository.insert(Tuple.of(id, key), value, principal));
  }

  @Override
  public void update(UUID id, User value, User principal) {
    userWriteRepository.update(id, value, principal);

    MapDifference<String, String> propertiesDiff = Maps
        .difference(value.getProperties(), properties(id, principal));

    propertiesDiff.entriesOnlyOnLeft()
        .forEach((k, v) -> userPropertiesWriteRepository.insert(Tuple.of(id, k), v, principal));
    propertiesDiff.entriesDiffering()
        .forEach((k, v) -> userPropertiesWriteRepository
            .update(Tuple.of(id, k), v.leftValue(), principal));
    propertiesDiff.entriesOnlyOnRight()
        .forEach((k, v) -> userPropertiesWriteRepository.delete(Tuple.of(id, k), principal));
  }

  private Map<String, String> properties(UUID userId, User principal) {
    try (Stream<Tuple2<Tuple2<UUID, String>, String>> entries = userPropertiesReadRepository
        .entries(UserPropertiesCriteria.byUserId(userId), principal)) {
      return entries.collect(Collectors.toMap(
          e -> e._1._2,
          e -> e._2));
    }
  }

  @Override
  public void delete(UUID id, User principal) {
    userPropertiesReadRepository.forEachEntry(UserPropertiesCriteria.byUserId(id), principal,
        (k, v) -> userPropertiesWriteRepository.delete(Tuple.of(id, k._2), principal));

    userWriteRepository.delete(id, principal);
  }

}
