package com.medical.backend.service;

import com.medical.backend.model.MedicalReport;
import com.medical.backend.repository.MedicalReportRepository;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final MedicalReportRepository medicalReportRepository;
    private final EmailService emailService;
    private final ImageAnalysisService imageAnalysisService; // ✅ use this instead of PdfGeneratorService

    public void sendReportByEmail(String reportId, String email) throws Exception {
        Optional<ResponseEntity<byte[]>> pdfOpt = imageAnalysisService.generatePdf(reportId);
        if (pdfOpt.isEmpty()) throw new Exception("PDF generation failed");

        byte[] pdfBytes = pdfOpt.get().getBody();
        emailService.sendPdfByEmail(email, pdfBytes, reportId);
    }
}
