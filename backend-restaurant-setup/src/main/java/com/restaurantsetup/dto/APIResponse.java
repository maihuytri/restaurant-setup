package com.restaurantsetup.dto;

public class APIResponse {
    private int errorCode;
    private String message;
    private Object data;

    // Default Constructor
    public APIResponse() {
    }

    // Constructor with all fields
    public APIResponse(int errorCode, String message, Object data) {
        this.errorCode = errorCode;
        this.message = message;
        this.data = data;
    }

    // Getters and Setters
    public int getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(int errorCode) {
        this.errorCode = errorCode;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
