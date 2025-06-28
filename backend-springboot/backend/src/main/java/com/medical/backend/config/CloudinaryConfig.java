package com.medical.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
            "cloud_name", "dart9yapa",
            "api_key", "224297278414579",
            "api_secret", "XWZN6xsZUWXFFDdGLZ3Fo2Y4mAs",
            "secure", true
        ));
    }
}

