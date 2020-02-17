package fi.vero.lakied.util.criteria;

import com.google.gson.JsonObject;

/**
 * Criteria that is expressed as JSON object.
 */
public interface JsonCriteria<K, V> extends Criteria<K, V> {

  JsonObject query();

}
