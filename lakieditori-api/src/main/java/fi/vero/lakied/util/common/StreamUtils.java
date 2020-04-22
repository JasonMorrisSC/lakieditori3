package fi.vero.lakied.util.common;

import static java.util.Spliterators.spliteratorUnknownSize;
import static java.util.stream.StreamSupport.stream;

import java.util.Iterator;
import java.util.Spliterator;
import java.util.function.BiConsumer;
import java.util.function.BiFunction;
import java.util.stream.IntStream;
import java.util.stream.Stream;

public final class StreamUtils {

  private StreamUtils() {
  }

  /**
   * Zip two streams. If one stream is longer, zipper function will be called with null values.
   */
  public static <L, R, Z> Stream<Z> zipFull(Stream<L> l, Stream<R> r, BiFunction<L, R, Z> zipper) {
    return stream(spliteratorUnknownSize(new Iterator<Z>() {
      Iterator<L> leftIterator = l.iterator();
      Iterator<R> rightIterator = r.iterator();

      @Override
      public boolean hasNext() {
        return leftIterator.hasNext() || rightIterator.hasNext();
      }

      @Override
      public Z next() {
        return zipper.apply(
            leftIterator.hasNext() ? leftIterator.next() : null,
            rightIterator.hasNext() ? rightIterator.next() : null);
      }
    }, Spliterator.ORDERED), l.isParallel() || r.isParallel());
  }

  public static <L, R, Z> Stream<Z> zipFullWithIndex(Stream<L> l, Stream<R> r,
      BiFunctionWithIndex<L, R, Z> zipper) {
    return stream(spliteratorUnknownSize(new Iterator<Z>() {
      int index = 0;
      Iterator<L> leftIterator = l.iterator();
      Iterator<R> rightIterator = r.iterator();

      @Override
      public boolean hasNext() {
        return leftIterator.hasNext() || rightIterator.hasNext();
      }

      @Override
      public Z next() {
        return zipper.apply(
            leftIterator.hasNext() ? leftIterator.next() : null,
            rightIterator.hasNext() ? rightIterator.next() : null,
            index++);
      }
    }, Spliterator.ORDERED), l.isParallel() || r.isParallel());
  }

  public interface BiFunctionWithIndex<T, U, R> {

    R apply(T t, U u, Integer index);

  }

  public static <E> Stream<Tuple2<E, Integer>> mapWithIndex(Stream<E> stream) {
    return zipFull(stream, IntStream.of(0).boxed(), Tuple::of);
  }

  public static <E> void forEachWithIndex(Stream<E> stream, BiConsumer<E, Integer> consumer) {
    zipFull(stream, IntStream.of(0).boxed(), Tuple::of).forEach(t -> consumer.accept(t._1, t._2));
  }

}
