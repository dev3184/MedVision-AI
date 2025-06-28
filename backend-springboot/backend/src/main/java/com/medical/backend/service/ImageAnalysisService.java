package com.medical.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import java.awt.Color;
import com.medical.backend.model.MedicalReport;
import com.medical.backend.repository.MedicalReportRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import org.springframework.beans.factory.annotation.Autowired;
// import java.net.http.HttpHeaders; // Remove incorrect import
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.Scanner;
import java.util.UUID;
import java.util.function.BiConsumer;

@Service
@RequiredArgsConstructor
public class ImageAnalysisService {

    private final MedicalReportRepository reportRepository;

    public String analyzeImage(MultipartFile file) throws Exception {

        // Save temp image
        File tempFile = File.createTempFile("upload", file.getOriginalFilename());
        try (FileOutputStream fos = new FileOutputStream(tempFile)) {
            fos.write(file.getBytes());
        }

        // Send image to Python FastAPI
        URL url = new URL("http://localhost:5000/analyze");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setDoOutput(true);
        conn.setRequestMethod("POST");

        String boundary = "boundary123";
        conn.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + boundary);

        var output = conn.getOutputStream();
        var writer = new java.io.PrintWriter(output, true);
        var CRLF = "\r\n";

        writer.append("--").append(boundary).append(CRLF);
        writer.append("Content-Disposition: form-data; name=\"file\"; filename=\"")
                .append(file.getOriginalFilename()).append("\"").append(CRLF);
        writer.append("Content-Type: ").append(file.getContentType()).append(CRLF);
        writer.append(CRLF).flush();
        java.nio.file.Files.copy(tempFile.toPath(), output);
        output.flush();
        writer.append(CRLF).flush();
        writer.append("--").append(boundary).append("--").append(CRLF);
        writer.close();

        // Parse response from Python
        String response = new Scanner(conn.getInputStream()).useDelimiter("\\A").next();
        ObjectMapper mapper = new ObjectMapper();
        JsonNode reportJson = mapper.readTree(response).get("report");

        // Extract fields from JSON
        String uuid = UUID.randomUUID().toString();
        MedicalReport report = MedicalReport.builder()
                .id(uuid)
                .imageName(file.getOriginalFilename())
                .imageType(reportJson.get("modality").asText(null))
                .region(reportJson.get("region").asText(null))
                .keyFindings(reportJson.get("findings").asText(""))
                .diagnosticAssessment(reportJson.get("diagnosis").asText(null))
                .patientExplanation(reportJson.get("explanation").asText(null))
                .references(reportJson.get("references").asText(null))
                .timestamp(LocalDateTime.now())
                .build();

        reportRepository.save(report);

        // Clean up
        tempFile.delete();

        return uuid;
    }

    public Optional<MedicalReport> getReportById(String id) {
        return reportRepository.findById(id);
    }

    public String chatWithReport(String uuid, String userQuestion) throws Exception {
        Optional<MedicalReport> reportOpt = reportRepository.findById(uuid);
        if (reportOpt.isEmpty()) {
            throw new Exception("Report not found");
        }

        MedicalReport report = reportOpt.get();

        // 🔧 Build context string safely
        StringBuilder contextBuilder = new StringBuilder();
        if (report.getKeyFindings() != null)
            contextBuilder.append(report.getKeyFindings()).append("\n");
        if (report.getDiagnosticAssessment() != null)
            contextBuilder.append(report.getDiagnosticAssessment()).append("\n");
        if (report.getPatientExplanation() != null)
            contextBuilder.append(report.getPatientExplanation());

        String context = contextBuilder.toString();

        // 🧠 Prepare JSON payload
        ObjectMapper mapper = new ObjectMapper();
        String payload = mapper.writeValueAsString(Map.of(
                "question", userQuestion,
                "report_context", context));

        // 🌐 Send POST to Python /chat endpoint
        URL url = new URL("http://localhost:5000/chat");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setConnectTimeout(10000);
        conn.setReadTimeout(30000);
        conn.setDoOutput(true);
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");

        try (OutputStream os = conn.getOutputStream()) {
            os.write(payload.getBytes("UTF-8"));
        }

        int responseCode = conn.getResponseCode();
        if (responseCode != HttpURLConnection.HTTP_OK) {
            throw new RuntimeException("Python service returned code: " + responseCode);
        }

        String response;
        try (Scanner scanner = new Scanner(conn.getInputStream()).useDelimiter("\\A")) {
            response = scanner.hasNext() ? scanner.next() : "";
        }

        JsonNode jsonNode = mapper.readTree(response);
        return jsonNode.get("answer").asText();
    }

    public Optional<ResponseEntity<byte[]>> generatePdf(String id) {
        Optional<MedicalReport> reportOpt = reportRepository.findById(id);
        if (reportOpt.isEmpty())
            return Optional.empty();

        MedicalReport report = reportOpt.get();

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 50, 50, 50, 50);
            PdfWriter.getInstance(document, out);
            document.open();

            // ===== 🖼️ LOGO + TAGLINE =====
            try {
                InputStream logoStream = getClass().getResourceAsStream("/static/logo.png");
                if (logoStream != null) {
                    Image logo = Image.getInstance(logoStream.readAllBytes());
                    logo.scaleToFit(100, 100); // ⬅️ Bigger logo
                    logo.setAlignment(Image.ALIGN_CENTER);
                    document.add(logo);

                    // Tagline
                    Font taglineFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 10, Color.GRAY);
                    Paragraph tagline = new Paragraph("MedVision AI – AI-Powered Imaging Report", taglineFont);
                    tagline.setAlignment(Element.ALIGN_CENTER);
                    tagline.setSpacingAfter(10f);
                    document.add(tagline);
                }
            } catch (Exception ex) {
                System.err.println("Logo not found: " + ex.getMessage());
            }

            // ===== 🧾 TITLE =====
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.BLACK);
            Paragraph header = new Paragraph("Analysis Report", titleFont);
            header.setAlignment(Element.ALIGN_CENTER);
            header.setSpacingAfter(20f);
            document.add(header);

            // ===== 🖼️ PATIENT IMAGE =====
            try {
                Image medicalImage = Image.getInstance(new URL(report.getImageName()));
                medicalImage.scaleToFit(300, 300);
                medicalImage.setAlignment(Image.ALIGN_CENTER);
                medicalImage.setSpacingAfter(20f);
                document.add(medicalImage);
            } catch (Exception ex) {
                System.err.println("Could not load image: " + ex.getMessage());
            }

            // ===== 📋 Report Meta Info =====
            Font labelFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
            Font textFont = FontFactory.getFont(FontFactory.HELVETICA, 12);

            BiConsumer<String, String> addField = (label, value) -> {
                Paragraph field = new Paragraph();
                field.add(new Chunk(label + ": ", labelFont));
                field.add(new Chunk(value == null ? "N/A" : value, textFont));
                field.setSpacingAfter(10f);
                try {
                    document.add(field);
                } catch (DocumentException e) {
                    e.printStackTrace();
                }
            };

            addField.accept("Report ID", report.getId());
            addField.accept("Modality", report.getImageType());
            addField.accept("Region", report.getRegion());

            // ===== 🧠 Key Findings =====
            document.add(new Paragraph("Key Findings:", labelFont));
            document.add(new Paragraph(report.getKeyFindings(), textFont));
            document.add(new Paragraph("\n"));

            // ===== 🩺 Diagnostic Assessment =====
            document.add(new Paragraph("Diagnostic Assessment:", labelFont));
            document.add(new Paragraph(report.getDiagnosticAssessment(), textFont));
            document.add(new Paragraph("\n"));

            // ===== 👨‍⚕️ Patient Explanation =====
            document.add(new Paragraph("Patient-Friendly Explanation:", labelFont));
            document.add(new Paragraph(report.getPatientExplanation(), textFont));

            // ===== ⚠️ DISCLAIMER =====
            Font disclaimerFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 8, Color.GRAY);
            Paragraph disclaimer = new Paragraph(
                    "This report is generated by AI and should be reviewed by a qualified healthcare professional for clinical decision-making.",
                    disclaimerFont);
            disclaimer.setAlignment(Element.ALIGN_CENTER);
            disclaimer.setSpacingBefore(20f); // Add some space before the disclaimer
            document.add(disclaimer);

            document.close();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "report-" + id + ".pdf");

            return Optional.of(ResponseEntity.ok().headers(headers).body(out.toByteArray()));
        } catch (Exception e) {
            e.printStackTrace();
            return Optional.empty();
        }
    }

    @Autowired
    private EmailService emailService;

    public void emailPdfReport(String reportId, String email) throws Exception {
        var pdfResponse = generatePdf(reportId);
        if (pdfResponse.isEmpty())
            throw new Exception("PDF generation failed");

        byte[] pdfBytes = pdfResponse.get().getBody();
        emailService.sendPdfByEmail(email, pdfBytes, reportId);
    }

}
