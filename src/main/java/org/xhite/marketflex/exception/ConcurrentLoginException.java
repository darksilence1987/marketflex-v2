package org.xhite.marketflex.exception;

public class ConcurrentLoginException extends RuntimeException {
    
        public ConcurrentLoginException(String message) {
            super(message);
        }
    
        public ConcurrentLoginException(String message, Throwable cause) {
            super(message, cause);
        }
}
