package com.company.website.api;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactRequest(
        @NotBlank @Size(min = 2, max = 120) String name,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 5, max = 150) String company,
        @NotBlank @Size(min = 15, max = 2000) String message) {
}