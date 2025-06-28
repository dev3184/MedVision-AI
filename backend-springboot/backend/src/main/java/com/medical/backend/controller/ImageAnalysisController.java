package com.medical.backend.controller;

import com.medical.backend.model.MedicalReport;
import com.medical.backend.repository.MedicalReportRepository;
import com.medical.backend.service.ImageAnalysisService;
import com.medical.backend.service.ImageUploadService;
import com.medical.backend.service.ReportService;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ImageAnalysisController {

    private final MedicalReportRepository medicalReportRepository;

    private final ImageAnalysisService analysisService;
    private final ImageUploadService imageUploadService;
    private final ReportService reportService;

    @GetMapping("/report/{id}")
    public ResponseEntity<MedicalReport> getReportById(@PathVariable String id) {
        return analysisService.getReportById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/report/{id}/chat")
    public ResponseEntity<?> chatWithReport(@PathVariable String id, @RequestBody Map<String, String> body) {
        try {
            String userQuestion = body.get("question");
            String answer = analysisService.chatWithReport(id, userQuestion);
            return ResponseEntity.ok(Map.of("answer", answer));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/report/{id}/pdf")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable String id) {
        return analysisService.generatePdf(id)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadReport(@RequestParam("file") MultipartFile file) {
        try {
            // 1. Upload to Cloudinary
            String imageUrl = imageUploadService.uploadImage(file);

            // 2. Call AI microservice
            Map<String, Object> aiReport = imageUploadService.analyzeImage(imageUrl);

            // 3. Check for error in AI response
            if (aiReport == null || aiReport.get("modality") == null || aiReport.get("region") == null) {
                return ResponseEntity.status(500).body(Map.of("error", "AI analysis failed or incomplete."));
            }

            // 4. Extract fields
            String modality = (String) aiReport.get("modality");
            String region = (String) aiReport.get("region");
            String findings = (String) aiReport.get("findings");
            String diagnosis = (String) aiReport.get("diagnosis");
            String explanation = (String) aiReport.get("explanation");
            String references = (String) aiReport.get("references");

            // 5. Build and save report
            MedicalReport report = MedicalReport.builder()
                    .id(UUID.randomUUID().toString())
                    .imageName(imageUrl)
                    .imageType(modality)
                    .region(region)
                    .keyFindings(findings)
                    .diagnosticAssessment(diagnosis)
                    .patientExplanation(explanation)
                    .references(references)
                    .timestamp(LocalDateTime.now())
                    .build();

            medicalReportRepository.save(report);

            return ResponseEntity.ok(report);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/report/{id}/email")
    public ResponseEntity<?> sendPdfToEmail(@PathVariable String id, @RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            reportService.sendReportByEmail(id, email);
            return ResponseEntity.ok(Map.of("message", "Email sent successfully!"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

}
