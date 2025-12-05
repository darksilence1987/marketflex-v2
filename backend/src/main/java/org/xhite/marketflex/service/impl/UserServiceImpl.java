package org.xhite.marketflex.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.xhite.marketflex.dto.RegisterRequest;
import org.xhite.marketflex.dto.UpdateProfileRequest;
import org.xhite.marketflex.model.AppUser;
import org.xhite.marketflex.model.enums.Role;
import org.xhite.marketflex.repository.UserRepository;
import org.xhite.marketflex.service.UserService;
import org.xhite.marketflex.exception.BusinessException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.xhite.marketflex.exception.UnauthorizedException;
import org.xhite.marketflex.exception.UserNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AppUser getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated() || 
            authentication instanceof AnonymousAuthenticationToken) {
            throw new UnauthorizedException("No authenticated user found");
        }

        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
    }

    @Override
    public AppUser registerUser(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new BusinessException("Email already registered: " + request.email());
        }

        AppUser user = new AppUser();
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setPhoneNumber(request.phoneNumber());
        user.addRole(Role.CUSTOMER);
        user.setEnabled(true);

        log.info("Registering new user: {}", request.email());
        return userRepository.save(user);
    }

    @Override
    public AppUser updateProfile(UpdateProfileRequest request) {
        AppUser user = getCurrentUser();
        
        // Update only non-null fields
        if (request.firstName() != null && !request.firstName().isBlank()) {
            user.setFirstName(request.firstName());
        }
        if (request.lastName() != null && !request.lastName().isBlank()) {
            user.setLastName(request.lastName());
        }
        if (request.phoneNumber() != null) {
            user.setPhoneNumber(request.phoneNumber());
        }
        if (request.street() != null) {
            user.setStreet(request.street());
        }
        if (request.city() != null) {
            user.setCity(request.city());
        }
        if (request.state() != null) {
            user.setState(request.state());
        }
        if (request.zipCode() != null) {
            user.setZipCode(request.zipCode());
        }
        if (request.country() != null) {
            user.setCountry(request.country());
        }

        log.info("Updating profile for user: {}", user.getEmail());
        return userRepository.save(user);
    }
}
