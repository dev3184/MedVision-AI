package com.medical.backend.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping
    public String hello() {
        return "Spring Boot is running!";
    }
}
