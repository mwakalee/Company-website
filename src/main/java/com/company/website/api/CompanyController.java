package com.company.website.api;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class CompanyController {

    @GetMapping("/profile")
    public CompanyProfileResponse getProfile() {
        return new CompanyProfileResponse(
                "NovaForge Labs",
                "Build Stunning Digital Experiences",
                "We blend strategy, engineering, and design to craft premium web products for modern brands.",
                List.of(
                        new Highlight("Immersive UX", "Cinematic interactions and smooth transitions for unforgettable first impressions.", "✨"),
                        new Highlight("Performance Driven", "Fast-loading architecture with enterprise-grade reliability.", "⚡"),
                        new Highlight("Growth Focused", "Data-informed design decisions that convert visitors into customers.", "📈")),
                List.of("120+ launches", "99.95% uptime", "18 countries served"),
                List.of("Spring Boot", "TypeScript", "React", "Cloud Native", "Design Systems"));
    }

    @PostMapping("/contact")
    public ContactResponse submitContact(@Valid @RequestBody ContactRequest request) {
        return new ContactResponse(
                "SUCCESS",
                "Thanks " + request.name() + "! Our strategy team will contact you at " + request.email() + " within 24 hours.");
    }
}