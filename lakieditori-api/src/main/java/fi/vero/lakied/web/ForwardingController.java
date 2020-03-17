package fi.vero.lakied.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class ForwardingController {

  private Logger log = LoggerFactory.getLogger(getClass());

  // anything that
  // 1) isn't matched by other controllers and
  // 2) does not contain a dot in path,
  // will be assumed to be a SPA view and forwarded to root
  @GetMapping({"/**/{path:[^.]*}"})
  public String forwardToRoot(@PathVariable("path") String path) {
    log.debug("Forwarding {} to /", path);
    return "forward:/";
  }

}
