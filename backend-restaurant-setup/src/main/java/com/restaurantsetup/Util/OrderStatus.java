package com.restaurantsetup.Util;

public enum OrderStatus {
    PENDING,
    COMPLETED,
    CANCELED,
    IN_PROGRESS;

    public static OrderStatus getEnumByString(String name) {
        for (OrderStatus e : OrderStatus.values()) {
            if (e.name().equals(name))
                return e;
        }
        return null;
    }
}
