package com.bookstore.Api_Bookstore.payload;

import lombok.Data;

@Data
public class LoginRequest {
    private  String username;
    private  String password;
}
