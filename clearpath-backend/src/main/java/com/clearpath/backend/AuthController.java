package com.clearpath.backend;

import java.util.Map;
import java.util.HashMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.util.Date;


@RestController
@RequestMapping("/api/auth")

public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final String SECRET_KEY = "clearpath-secret-key-must-be-at-least-32-characters-long";

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String nickname = request.get("nickname");

        //Check the email already exists
        if (userRepository.findByEmail(email) != null) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Email already exists");
            return error;
        }

        //Create a new User
        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setNickname(nickname);
        user.setCreatedAt(java.time.LocalDateTime.now());

        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Registration successful");
        response.put("email", email);
        return response;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> request){
        String email = request.get("email");
        String password = request.get("password");

        User user = userRepository.findByEmail(email);

        if (user == null || !passwordEncoder.matches(password, user.getPasswordHash())) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Invalid email or password");
            return error;
        }

        user.setLastLogin(java.time.LocalDateTime.now());
        userRepository.save(user);

        String token = Jwts.builder()
                .setSubject(user.getEmail())
                .claim("userId", user.getId())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24小时
                .signWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()))
                .compact();

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login successful");
        response.put("token", token);
        response.put("email", user.getEmail());
        response.put("nickname", user.getNickname());
        response.put("userId", user.getId());
        return response;
    }
}
