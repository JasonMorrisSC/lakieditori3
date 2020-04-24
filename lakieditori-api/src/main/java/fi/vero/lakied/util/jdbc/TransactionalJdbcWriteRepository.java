package fi.vero.lakied.util.jdbc;

import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.security.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.interceptor.DefaultTransactionAttribute;

public class TransactionalJdbcWriteRepository<K, V> implements WriteRepository<K, V> {

  private final Logger log = LoggerFactory.getLogger(getClass());

  private final WriteRepository<K, V> delegate;

  private final PlatformTransactionManager manager;
  private final TransactionDefinition definition;

  public TransactionalJdbcWriteRepository(WriteRepository<K, V> delegate,
      PlatformTransactionManager manager) {
    this(delegate, manager, new DefaultTransactionAttribute());
  }

  public TransactionalJdbcWriteRepository(WriteRepository<K, V> delegate,
      PlatformTransactionManager manager,
      TransactionDefinition definition) {
    this.delegate = delegate;
    this.manager = manager;
    this.definition = definition;
  }

  @Override
  public void insert(K key, V value, User user) {
    runInTransaction(() -> delegate.insert(key, value, user));
  }

  @Override
  public void update(K key, V value, User user) {
    runInTransaction(() -> delegate.update(key, value, user));
  }

  @Override
  public void delete(K key, User user) {
    runInTransaction(() -> delegate.delete(key, user));
  }

  private void runInTransaction(Runnable runnable) {
    log.trace("Opening transaction");
    TransactionStatus tx = manager.getTransaction(definition);

    try {
      runnable.run();
    } catch (RuntimeException | Error e) {
      log.trace("Rolling back transaction");
      manager.rollback(tx);
      throw e;
    }

    log.trace("Committing transaction");
    manager.commit(tx);
  }

}
