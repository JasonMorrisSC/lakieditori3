package fi.vero.lakied.util.security;

import java.util.function.Function;
import java.util.function.UnaryOperator;

public interface PermissionEvaluator<E> {

  boolean hasPermission(User user, E object, Permission permission);

  static <E> PermissionEvaluator<E> denyAll() {
    return (u, o, p) -> false;
  }

  static <E> PermissionEvaluator<E> permitAll() {
    return (u, o, p) -> true;
  }

  static <E> PermissionEvaluator<E> permitAnonymous() {
    return (u, o, p) -> u == null;
  }

  static <E> PermissionEvaluator<E> permitAuthenticated() {
    return (u, o, p) -> u != null;
  }

  static <E> PermissionEvaluator<E> permitSuperuser() {
    return (u, o, p) -> u != null && u.isSuperuser();
  }

  static <E> PermissionEvaluator<E> permitRead() {
    return (u, o, p) -> p == Permission.READ;
  }

  static <E> PermissionEvaluator<E> permitInsert() {
    return (u, o, p) -> p == Permission.INSERT;
  }

  static <E> PermissionEvaluator<E> permitUpdate() {
    return (u, o, p) -> p == Permission.UPDATE;
  }

  static <E> PermissionEvaluator<E> permitDelete() {
    return (u, o, p) -> p == Permission.DELETE;
  }

  default PermissionEvaluator<E> and(PermissionEvaluator<E> evaluator) {
    return (u, o, p) -> hasPermission(u, o, p) && evaluator.hasPermission(u, o, p);
  }

  default PermissionEvaluator<E> or(PermissionEvaluator<E> evaluator) {
    return (u, o, p) -> hasPermission(u, o, p) || evaluator.hasPermission(u, o, p);
  }

  default PermissionEvaluator<E> not() {
    return (u, o, p) -> !hasPermission(u, o, p);
  }

  default <T> PermissionEvaluator<T> mapObject(Function<T, E> mapping) {
    return (u, o, p) -> hasPermission(u, mapping.apply(o), p);
  }

  default PermissionEvaluator<E> mapPermission(UnaryOperator<Permission> mapping) {
    return (u, o, p) -> hasPermission(u, o, mapping.apply(p));
  }

}
