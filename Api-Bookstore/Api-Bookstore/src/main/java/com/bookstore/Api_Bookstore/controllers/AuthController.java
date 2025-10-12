package com.bookstore.Api_Bookstore.controllers;

import com.bookstore.Api_Bookstore.models.User;
import com.bookstore.Api_Bookstore.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
public class AuthController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User newUser){
        if (userRepository.existsByUsername(newUser.getUsername())){
            return new ResponseEntity<>("đã có tên này trước đó", HttpStatus.BAD_REQUEST);
        }
        if (userRepository.existsByEmail(newUser.getEmail())){
            return new ResponseEntity<>("email trùng rồi",HttpStatus.BAD_REQUEST);
        }
        newUser.setPassword(passwordEncoder.encode((newUser.getPassword())));
        userRepository.save(newUser);
        return new ResponseEntity<>("User registered successfully!",HttpStatus.CREATED);
    }
}
