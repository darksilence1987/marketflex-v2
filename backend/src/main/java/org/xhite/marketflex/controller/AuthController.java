package org.xhite.marketflex.controller;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import org.xhite.marketflex.dto.AuthResponse;
import org.xhite.marketflex.dto.LoginRequest;
import org.xhite.marketflex.dto.RegisterRequest;
import org.xhite.marketflex.model.AppUser;
import org.xhite.marketflex.repository.UserRepository;
import org.xhite.marketflex.security.CustomUserDetailsService;
import org.xhite.marketflex.security.JwtTokenProvider;
import org.xhite.marketflex.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserDetailsService userDetailsService;
    private final UserRepository userRepository;
    private final UserService userService;

    /**
     * POST /api/v1/auth/login - Authenticate user and return JWT
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.email(),
                request.password()
            )
        );

        String jwt = tokenProvider.generateToken(authentication);
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        AppUser user = ((CustomUserDetailsService) userDetailsService)
            .getUserByEmail(userDetails.getUsername());

        user.setLastLoginDate(LocalDateTime.now());
        userRepository.save(user);
        
        String primaryRole = user.getRoles().stream()
            .findFirst()
            .map(Enum::name)
            .orElse("CUSTOMER");
        
        return ResponseEntity.ok(AuthResponse.builder()
            .token(jwt)
            .tokenType("Bearer")
            .email(user.getEmail())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .role(primaryRole)
            .phone(user.getPhoneNumber())
            .street(user.getStreet())
            .city(user.getCity())
            .state(user.getState())
            .zipCode(user.getZipCode())
            .country(user.getCountry())
            .build());
    }

    /**
     * POST /api/v1/auth/register - Register new user
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AppUser user = userService.registerUser(request);
        
        // Auto-login after registration
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.email(),
                request.password()
            )
        );
        
        String jwt = tokenProvider.generateToken(authentication);
        
        String primaryRole = user.getRoles().stream()
            .findFirst()
            .map(Enum::name)
            .orElse("CUSTOMER");
        
        return ResponseEntity.status(HttpStatus.CREATED).body(AuthResponse.builder()
            .token(jwt)
            .tokenType("Bearer")
            .email(user.getEmail())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .role(primaryRole)
            .phone(user.getPhoneNumber())
            .street(user.getStreet())
            .city(user.getCity())
            .state(user.getState())
            .zipCode(user.getZipCode())
            .country(user.getCountry())
            .build());
    }

    /**
     * GET /api/v1/auth/me - Get current authenticated user
     */
    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails) {
        AppUser user = ((CustomUserDetailsService) userDetailsService)
            .getUserByEmail(userDetails.getUsername());
        
        String primaryRole = user.getRoles().stream()
            .findFirst()
            .map(Enum::name)
            .orElse("CUSTOMER");
        
        return ResponseEntity.ok(AuthResponse.builder()
            .email(user.getEmail())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .role(primaryRole)
            .phone(user.getPhoneNumber())
            .street(user.getStreet())
            .city(user.getCity())
            .state(user.getState())
            .zipCode(user.getZipCode())
            .country(user.getCountry())
            .build());
    }

    /**
     * POST /api/v1/auth/refresh - Refresh JWT token
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(
            @AuthenticationPrincipal UserDetails userDetails) {
        // Generate new token from current authentication
        Authentication authentication = new UsernamePasswordAuthenticationToken(
            userDetails, null, userDetails.getAuthorities());
        String jwt = tokenProvider.generateToken(authentication);
        
        AppUser user = ((CustomUserDetailsService) userDetailsService)
            .getUserByEmail(userDetails.getUsername());
        
        String primaryRole = user.getRoles().stream()
            .findFirst()
            .map(Enum::name)
            .orElse("CUSTOMER");
        
        return ResponseEntity.ok(AuthResponse.builder()
            .token(jwt)
            .tokenType("Bearer")
            .email(user.getEmail())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .role(primaryRole)
            .phone(user.getPhoneNumber())
            .street(user.getStreet())
            .city(user.getCity())
            .state(user.getState())
            .zipCode(user.getZipCode())
            .country(user.getCountry())
            .build());
    }
}