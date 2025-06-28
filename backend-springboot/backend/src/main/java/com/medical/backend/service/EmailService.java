package com.medical.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendPdfByEmail(String to, byte[] pdfBytes, String reportId) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(to);
        helper.setSubject("Your Medical Report PDF");
        helper.setText("Attached is your medical report.\n\nRegards,\nMedical AI System");

        helper.addAttachment("report-" + reportId + ".pdf", new ByteArrayResource(pdfBytes));
        mailSender.send(message);
    }
}
