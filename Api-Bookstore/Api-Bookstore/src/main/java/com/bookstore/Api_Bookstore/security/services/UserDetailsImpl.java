package com.bookstore.Api_Bookstore.security.services;

import com.bookstore.Api_Bookstore.models.Role;
import com.bookstore.Api_Bookstore.models.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.logging.SimpleFormatter;
import java.util.stream.Collectors;

@Getter

public class UserDetailsImpl implements UserDetails {
    private final Long id;
    private final String username;
    @JsonIgnore
    private final String password;
    private final String email;

    private Collection<? extends GrantedAuthority>authorities;
    public UserDetailsImpl(Long id,String username,String password, String email,
                           Collection<? extends GrantedAuthority>authorities){
        this.id = id;
        this.username=username;
        this.password = password;
        this.email = email;
        this.authorities =  authorities;

    }

    public static UserDetailsImpl build(User user) {
        List<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toList());

        return new UserDetailsImpl(
                user.getId(),
                user.getUsername(),
                user.getPassword(),
                user.getEmail(),
                authorities
        );
    }





    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Tạm thời chưa dùng Roles, trả về một danh sách rỗng
        return authorities;
    }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }

    @Override
    public boolean equals(Object o){
        if (this == o){
            return true;
        }
        if (o == null || getClass() != o.getClass()){
            return false;
        }
        UserDetailsImpl user = (UserDetailsImpl) o;
        return Objects.equals(id, user.id);
    }
}
