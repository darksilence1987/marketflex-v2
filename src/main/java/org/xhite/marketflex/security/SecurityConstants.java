package org.xhite.marketflex.security;

public class SecurityConstants {
    public static final String SECRET_KEY = "${JWT_SECRET:defaultSecretKey}";
    public static final long EXPIRATION_TIME = 864_000_000; // 10 days
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";
    public static final String SIGN_UP_URL = "/api/auth/register";
    public static final String LOGIN_URL = "/api/auth/login";
}