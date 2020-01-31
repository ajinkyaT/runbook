package com.bizreach.training.runnerbook;

import com.bizreach.training.runnerbook.model.Role;
import com.bizreach.training.runnerbook.model.RoleName;
import com.bizreach.training.runnerbook.repository.RoleRepository;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@SpringBootApplication
@EnableJpaAuditing
public class RunnerbookApplication implements ErrorController {

	@Autowired
	private RoleRepository roleRepository;

	private static final String PATH = "/error";

	@RequestMapping(value = PATH)
	public String error() {
		return "forward:/index.html";
	}

	@Override
	public String getErrorPath() {
		return PATH;
	}

	public static void main(String[] args) {
		SpringApplication.run(RunnerbookApplication.class, args);
	}
	@Bean
	InitializingBean sendDatabase() {
		return () -> {
			roleRepository.save(new Role(RoleName.ROLE_USER));
		};
	}
}
