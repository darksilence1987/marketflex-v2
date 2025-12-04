package org.xhite.marketflex.security;

import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.xhite.marketflex.model.AppUser;
import org.xhite.marketflex.model.enums.Role;
import org.xhite.marketflex.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class CustomUserDetailsServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CustomUserDetailsService userDetailsService;

    private AppUser testUser;

    @BeforeEach
    void setUp() {
        testUser = AppUser.builder()
            .email("test@example.com")
            .password("encodedPassword")
            .roles(Set.of(Role.CUSTOMER))
            .enabled(true)
            .accountNonLocked(true)
            .build();
    }

    @Test
    void loadUserByUsername_WhenUserExists_ReturnsUserDetails() {
        when(userRepository.findByEmail("test@example.com"))
            .thenReturn(Optional.of(testUser));

        UserDetails userDetails = userDetailsService.loadUserByUsername("test@example.com");

        assertThat(userDetails).isNotNull();
        assertThat(userDetails.getUsername()).isEqualTo("test@example.com");
        assertThat(userDetails.getPassword()).isEqualTo("encodedPassword");
        assertThat(userDetails.getAuthorities()).hasSize(1);
        assertThat(userDetails.getAuthorities().iterator().next().getAuthority())
            .isEqualTo("ROLE_CUSTOMER");
    }

    @Test
    void loadUserByUsername_WhenUserNotFound_ThrowsException() {
        when(userRepository.findByEmail("nonexistent@example.com"))
            .thenReturn(Optional.empty());

        assertThatThrownBy(() -> 
            userDetailsService.loadUserByUsername("nonexistent@example.com"))
            .isInstanceOf(UsernameNotFoundException.class)
            .hasMessageContaining("User not found");
    }
}