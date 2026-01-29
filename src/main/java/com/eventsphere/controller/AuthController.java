package com.eventsphere.controller;

import com.eventsphere.dto.LoginRequest;
import com.eventsphere.dto.LoginResponse;
import com.eventsphere.entity.User;
import com.eventsphere.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.eventsphere.security.JwtUtil;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") 
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
		this.jwtUtil = jwtUtil;
    }

    // ✅ SIGNUP API
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        // check email exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email already registered"));
        }

        // encrypt password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // normalize role
        user.setRole(user.getRole().toUpperCase());

        userRepository.save(user);

        return ResponseEntity.ok(
                Map.of("message", "User registered successfully")
        );
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return ResponseEntity
                    .status(401)
                    .body(Map.of("message", "Invalid email"));
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity
                    .status(401)
                    .body(Map.of("message", "Invalid password"));
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        return ResponseEntity.ok(
                new LoginResponse(token, user.getRole())
        );
    }

}
