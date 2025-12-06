package org.xhite.marketflex.model.enums;

public enum Role {
    CUSTOMER,
    MANAGER,
    VENDOR,
    ADMIN;

    public String getName() {
        return this.name();
    } 
}
