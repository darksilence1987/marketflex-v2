package org.xhite.marketflex.event;
import java.time.LocalDateTime;

import org.springframework.context.ApplicationListener;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.xhite.marketflex.exception.ConcurrentLoginException;
import org.xhite.marketflex.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Component
@RequiredArgsConstructor
@Slf4j
public class LoginSuccessHandler implements ApplicationListener<AuthenticationSuccessEvent> {
    
    private final UserRepository userRepository;
    private static final int MAX_RETRIES = 3;
    private static final long RETRY_DELAY = 100L; // milliseconds
    
    @Override
    @Transactional
    public void onApplicationEvent(AuthenticationSuccessEvent event) {
        String email = ((UserDetails) event.getAuthentication().getPrincipal()).getUsername();
        int attempts = 0;
        
        while (attempts < MAX_RETRIES) {
            try {
                updateLastLoginDate(email);
                return;
            } catch (ObjectOptimisticLockingFailureException e) {
                attempts++;
                if (attempts == MAX_RETRIES) {
                    log.error("Failed to update last login date for user {} after {} attempts", email, MAX_RETRIES);
                    throw new ConcurrentLoginException("Unable to process login due to concurrent modifications", e);
                }
                log.warn("Concurrent modification detected for user {}, attempt {}/{}", email, attempts, MAX_RETRIES);
                try {
                    Thread.sleep(RETRY_DELAY);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new ConcurrentLoginException("Login process interrupted", ie);
                }
            }
        }
    }
    
    private void updateLastLoginDate(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            user.setLastLoginDate(LocalDateTime.now());
            userRepository.save(user);
            log.debug("Updated last login date for user: {}", email);
        });
    }
}