package com.medical.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

// import org.apache.http.HttpEntity; // Remove this line
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
// import java.net.http.HttpHeaders; // Remove this line
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import java.util.Map;

@Service
public class ImageUploadService {

    @Autowired
    private Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        return uploadResult.get("secure_url").toString();  // this is the public image URL
    }
    public Map<String, Object> analyzeImage(String imageUrl) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> requestBody = Map.of("image_url", imageUrl);
        HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
            "http://localhost:5000/analyze", requestEntity, Map.class
        );

        // ✅ Unwrap the "report" field
        Map<String, Object> responseBody = response.getBody();
        return (Map<String, Object>) responseBody.get("report");
    }



}
