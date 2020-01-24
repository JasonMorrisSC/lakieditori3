package fi.vero.lakied;

import fi.vero.lakied.util.xml.XmlDocumentMessageConverter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.http.converter.HttpMessageConverter;
import org.w3c.dom.Document;

@SpringBootApplication
public class Application {

  public static void main(String[] args) {
    SpringApplication.run(Application.class, args);
  }

  @Bean
  public HttpMessageConverter<Document> xmlDocumentMessageConverter() {
    return new XmlDocumentMessageConverter();
  }

}
