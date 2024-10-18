package org.example.springfrontend;

import com.vaadin.flow.spring.annotation.EnableVaadin;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableVaadin("org.example.springfrontend")
public class SpringFrontendApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringFrontendApplication.class, args);
	}
}