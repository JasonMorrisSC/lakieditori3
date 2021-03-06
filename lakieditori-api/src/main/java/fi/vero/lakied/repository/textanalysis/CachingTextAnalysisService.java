package fi.vero.lakied.repository.textanalysis;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import fi.vero.lakied.util.common.Tuple;
import fi.vero.lakied.util.common.Tuple3;
import java.util.Set;

public class CachingTextAnalysisService implements TextAnalysisService {

  private final LoadingCache<Tuple3<String, Set<String>, String>, String> queryCache;

  public CachingTextAnalysisService(TextAnalysisService delegate) {
    this.queryCache = CacheBuilder.newBuilder()
        .softValues().maximumSize(100_000)
        .build(CacheLoader.from(
            tuple -> tuple != null ? delegate.lemma(tuple._1, tuple._2, tuple._3) : ""));
  }

  @Override
  public String lemma(String word, Set<String> tags, String lang) {
    return queryCache.getUnchecked(Tuple.of(word, tags, lang));
  }

}
