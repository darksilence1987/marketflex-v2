package org.xhite.marketflex.service;

import org.xhite.marketflex.dto.RegisterRequest;
import org.xhite.marketflex.model.AppUser;

public interface UserService {
    AppUser getCurrentUser();
    AppUser registerUser(RegisterRequest request);
}

