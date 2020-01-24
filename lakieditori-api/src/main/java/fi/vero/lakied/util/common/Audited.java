package fi.vero.lakied.util.common;

import java.time.LocalDateTime;

public class Audited<E> {

  public final String createdBy;
  public final LocalDateTime createdDate;
  public final String lastModifiedBy;
  public final LocalDateTime lastModifiedDate;

  public final E value;

  public Audited(
      String createdBy,
      LocalDateTime createdDate,
      String lastModifiedBy,
      LocalDateTime lastModifiedDate,
      E value) {
    this.createdBy = createdBy;
    this.createdDate = createdDate;
    this.lastModifiedBy = lastModifiedBy;
    this.lastModifiedDate = lastModifiedDate;
    this.value = value;
  }
}
