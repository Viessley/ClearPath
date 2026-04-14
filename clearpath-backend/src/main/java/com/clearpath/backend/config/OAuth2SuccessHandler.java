package com.clearpath.backend.config;

import com.clearpath.backend.entity.User;
import com.clearpath.backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Date;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private UserRepository userRepository;

    private final String SECRET_KEY = "clearpath-secret-key-must-be-at-least-32-characters-long";

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        // check user exist
        User user = userRepository.findByEmail(email);
        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setNickname(name);
            user.setPasswordHash("GOOGLE_OAUTH");
            user.setCreatedAt(LocalDateTime.now());
            userRepository.save(user);
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        // create JWT
        String token = Jwts.builder()
                .setSubject(email)
                .claim("userId", user.getId())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()))
                .compact();

        // back with token
        response.sendRedirect("https://clear-path-brown.vercel.app/auth/callback?token=" + token + "&userId=" + user.getId() + "&nickname=" + name);
    }
}