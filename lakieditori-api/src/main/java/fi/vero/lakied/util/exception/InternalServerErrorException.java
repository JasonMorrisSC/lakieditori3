package fi.vero.lakied.util.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
public class InternalServerErrorException extends RuntimeException {

  public InternalServerErrorException() {
  }

  public InternalServerErrorException(String message) {
    super(message);
  }

  public InternalServerErrorException(Throwable cause) {
    super(cause);
  }

}
