package fi.vero.lakied.util.common;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

public final class URLs {

  private URLs() {
  }

  public static String encode(String url) {
    try {
      return URLEncoder.encode(url, "UTF-8");
    } catch (UnsupportedEncodingException e) {
      throw new RuntimeException(e);
    }
  }

}
