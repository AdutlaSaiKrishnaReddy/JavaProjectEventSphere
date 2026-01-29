package com.eventsphere.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.eventsphere.security.JwtAuthFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private final JwtAuthFilter jwtAuthFilter;

	public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
		this.jwtAuthFilter = jwtAuthFilter;
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

		http.csrf(csrf -> csrf.disable()).cors(Customizer.withDefaults()) // ✅ IMPORTANT
				.authorizeHttpRequests(auth -> auth.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

						.requestMatchers("/api/auth/**", "/", "/index.html", "/login.html", "/signup.html",
								"/events.html", "/registered.html", "/navbar.html",
								"/admin.html",
								"/Styles/**", "/JavaScript/**",
								"/favicon.ico")
						.permitAll()

						.requestMatchers("/registeredEvents/**").authenticated()

						.requestMatchers(HttpMethod.POST, "/events/**").hasRole("ADMIN")
						.requestMatchers(HttpMethod.PUT, "/events/**").hasRole("ADMIN")
						.requestMatchers(HttpMethod.DELETE, "/events/**").hasRole("ADMIN")

						.requestMatchers(HttpMethod.GET, "/events/**").authenticated()

						.anyRequest().authenticated())

				.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
				.formLogin(form -> form.disable()).httpBasic(basic -> basic.disable());

		return http.build();
	}

}