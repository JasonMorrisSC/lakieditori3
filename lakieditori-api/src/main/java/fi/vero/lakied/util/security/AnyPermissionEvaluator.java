package fi.vero.lakied.util.security;

/**
 * Accepts if any of the evaluators accepts.
 */
public class AnyPermissionEvaluator<E> implements PermissionEvaluator<E> {

  private final PermissionEvaluator<E>[] evaluators;

  @SafeVarargs
  public AnyPermissionEvaluator(PermissionEvaluator<E>... evaluators) {
    this.evaluators = evaluators;
  }

  @Override
  public boolean hasPermission(User user, E object, Permission permission) {
    for (PermissionEvaluator<E> evaluator : evaluators) {
      if (evaluator.hasPermission(user, object, permission)) {
        return true;
      }
    }

    return false;
  }

}
