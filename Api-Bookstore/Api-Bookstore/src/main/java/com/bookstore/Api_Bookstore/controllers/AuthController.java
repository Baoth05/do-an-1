package com.bookstore.Api_Bookstore.controllers;

import com.bookstore.Api_Bookstore.models.Role;
import com.bookstore.Api_Bookstore.models.User;
import com.bookstore.Api_Bookstore.payload.JwtResponse;
import com.bookstore.Api_Bookstore.payload.LoginRequest;
import com.bookstore.Api_Bookstore.payload.RegisterRequest;
import com.bookstore.Api_Bookstore.repositories.RoleRepository;
import com.bookstore.Api_Bookstore.repositories.UserRepository;
import com.bookstore.Api_Bookstore.security.Jwt.JwtUtils;
import com.bookstore.Api_Bookstore.security.services.UserDetailsImpl;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final RoleRepository roleRepository;

    @Autowired
    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtUtils jwtUtils,RoleRepository roleRepository){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.roleRepository=roleRepository;
    }
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest ){
        if (userRepository.existsByUsername(registerRequest.getUsername())){
            return new ResponseEntity<>("đã có tên này trước đó", HttpStatus.BAD_REQUEST);
        }
        if (userRepository.existsByEmail(registerRequest.getEmail())){
            return new ResponseEntity<>("email trùng rồi",HttpStatus.BAD_REQUEST);
        }
        User user = new User(
                registerRequest.getUsername(),
                passwordEncoder.encode(registerRequest.getPassword()),
                registerRequest.getEmail(),
                registerRequest.getFullName(),
                registerRequest.getAddress()
        );
        Set<Role> roles = new HashSet<>();
        Role userRole =  roleRepository.findByName("ROLE_USER")
                .orElseThrow(()-> new RuntimeException("Lỗi: Không tìm thấy vai trò USER."));
        roles.add(userRole);
        user.setRoles(roles);

        userRepository.save(user);
        return new ResponseEntity<>("User registered successfully!",HttpStatus.CREATED);
    }
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest){

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(),loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));
    }


}
