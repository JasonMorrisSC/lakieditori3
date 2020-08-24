package fi.vero.lakied.util;

import static fi.vero.lakied.util.common.ResourceUtils.resourceToString;

import fi.vero.lakied.util.xml.XmlUtils;
import javax.xml.transform.dom.DOMSource;
import org.junit.jupiter.api.Test;
import org.w3c.dom.Document;

class StatuteToVnkTransformationTest {

  @Test
  void shouldTransformStatuteToVnkFormat() {
    Document vnkXsl = XmlUtils.parseUnchecked(
        resourceToString("transformations/vnk.xsl"));

    Document statute = XmlUtils
        .parseUnchecked(resourceToString("documents/statute/examples/statute_0.xml"));

    System.out.println(XmlUtils.print(statute, new DOMSource(vnkXsl)));
  }

}
