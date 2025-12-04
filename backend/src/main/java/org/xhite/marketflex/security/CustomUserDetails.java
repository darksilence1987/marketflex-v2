package org.xhite.marketflex.security;

import org.springframework.stereotype.Component;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.xhite.marketflex.model.AppUser;
import java.util.Collection;
import java.util.stream.Collectors;
import java.util.Collections;
import jakarta.persistence.Transient;
import lombok.RequiredArgsConstructor;
import org.xhite.marketflex.repository.UserRepository;



@Component
@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails {
    private static final long serialVersionUID = 1L;
    
    private final UserRepository userRepository;
    
    @Transient
    private String email;

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        AppUser user = getCurrentUser();
        if (user == null) return Collections.emptyList();
        
        return user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.name()))
                .collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        AppUser user = getCurrentUser();
        return user != null ? user.getPassword() : null;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        AppUser user = getCurrentUser();
        return user != null && user.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        AppUser user = getCurrentUser();
        return user != null && user.isEnabled();
    }

    private AppUser getCurrentUser() {
        if (email == null) return null;
        return userRepository.findByEmail(email).orElse(null);
    }
}
