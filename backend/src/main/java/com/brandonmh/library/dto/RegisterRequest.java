package com.brandonmh.library.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    @NotBlank(message = "Name must be provided.")
    public String name;
    @NotBlank(message = "Email must be provided.")
    public String email;
    @NotBlank(message = "Password must be provided.")
    public String password;
}