package fi.vero.lakied.web;

import static com.google.common.base.Charsets.UTF_8;
import static io.restassured.config.DecoderConfig.decoderConfig;
import static io.restassured.config.EncoderConfig.encoderConfig;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

import fi.vero.lakied.util.common.WriteRepository;
import fi.vero.lakied.util.security.User;
import io.restassured.RestAssured;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.config.RestAssuredConfig;
import io.restassured.specification.RequestSpecification;
import java.util.Base64;
import java.util.UUID;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestInstance.Lifecycle;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@TestInstance(Lifecycle.PER_CLASS)
@SpringBootTest(webEnvironment = RANDOM_PORT)
public abstract class BaseApiIntegrationTest {

  @Autowired
  private WriteRepository<UUID, User> userWriteRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @LocalServerPort
  private int serverPort;

  private UUID testAdminId = UUID.randomUUID();
  private String testAdminUsername = "test-admin";
  private String testAdminPassword = "test-admin";

  protected RequestSpecification adminAuthorizedRequest;

  @BeforeEach
  public void configRestAssured() {
    RestAssured.port = serverPort;
    RestAssured.config = RestAssuredConfig.config()
        .encoderConfig(encoderConfig().defaultContentCharset("UTF-8"))
        .decoderConfig(decoderConfig().defaultContentCharset("UTF-8"));

    adminAuthorizedRequest = new RequestSpecBuilder()
        .addHeader("Authorization", basicAuth(testAdminUsername, testAdminPassword))
        .build();
  }

  @BeforeAll
  public void insertTestUsers() {
    userWriteRepository.insert(
        testAdminId,
        User.superuser(testAdminUsername, passwordEncoder.encode(testAdminPassword)),
        User.superuser("test-initializer"));
  }

  @AfterAll
  public void deleteTestUsers() {
    userWriteRepository.delete(
        testAdminId,
        User.superuser("test-cleaner"));
  }

  private String basicAuth(String username, String password) {
    return "Basic " + encodeBase64(username + ":" + password);
  }

  private String encodeBase64(String str) {
    return Base64.getEncoder().encodeToString(str.getBytes(UTF_8));
  }

}
