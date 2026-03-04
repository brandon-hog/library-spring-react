package com.brandonmh.library.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "library_user") // avoid naming conflicts with db user table
public class User {
    @Id
    @GeneratedValue
    private Long id;

    private String name;

    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;

    @OneToMany(mappedBy = "user")
    private List<Checkout> checkouts;

    public User() {}

    public User(Long id, String name, String email, List<Checkout> checkouts) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.checkouts = checkouts;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<Checkout> getCheckouts() {
        return checkouts;
    }

    public void setCheckouts(List<Checkout> checkouts) {
        this.checkouts = checkouts;
    }

    public String getPassword() {
        return password; 
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
