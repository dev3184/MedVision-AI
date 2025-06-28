package com.medical.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "reports")
public class MedicalReport {
    @Id
    private String id; // UUID

    private String imageName;
    private String imageType;
    private String region;
    private String keyFindings;
    private String diagnosticAssessment;
    private String patientExplanation;
    private String references;
 


    private LocalDateTime timestamp;
}
