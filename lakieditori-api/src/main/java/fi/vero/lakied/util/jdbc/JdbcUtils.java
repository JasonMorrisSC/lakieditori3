package fi.vero.lakied.util.jdbc;

import com.google.common.collect.AbstractIterator;
import com.google.common.collect.Streams;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Iterator;
import java.util.stream.Stream;
import javax.sql.DataSource;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.InvalidResultSetAccessException;
import org.springframework.jdbc.core.ArgumentPreparedStatementSetter;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.datasource.DataSourceUtils;

public final class JdbcUtils {

  private JdbcUtils() {
  }

  /**
   * Returned Stream must be closed to release database connection.
   */
  public static <T> Stream<T> queryForStream(DataSource dataSource, String sql, Object[] args,
      RowMapper<T> rowMapper)
      throws DataAccessException {
    Connection connection = DataSourceUtils.getConnection(dataSource);

    try {
      PreparedStatement preparedStatement = connection.prepareStatement(sql);
      preparedStatement.setFetchSize(100);

      new ArgumentPreparedStatementSetter(args).setValues(preparedStatement);

      ResultSet resultSet = preparedStatement.executeQuery();

      return Streams.stream(resultSetToMappingIterator(resultSet, rowMapper))
          .onClose(() -> {
            org.springframework.jdbc.support.JdbcUtils.closeStatement(preparedStatement);
            org.springframework.jdbc.support.JdbcUtils.closeResultSet(resultSet);
            DataSourceUtils.releaseConnection(connection, dataSource);
          });
    } catch (SQLException | RuntimeException | Error e) {
      DataSourceUtils.releaseConnection(connection, dataSource);
      throw new RuntimeException(e);
    }
  }

  public static <T> Iterator<T> resultSetToMappingIterator(ResultSet rs, RowMapper<T> rowMapper) {
    return new AbstractIterator<T>() {
      @Override
      protected T computeNext() {
        try {
          return rs.next() ? rowMapper.mapRow(rs, rs.getRow()) : endOfData();
        } catch (SQLException e) {
          throw new InvalidResultSetAccessException(e);
        }
      }
    };
  }

}
