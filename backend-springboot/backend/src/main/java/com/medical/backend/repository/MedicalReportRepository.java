package com.medical.backend.repository;

import com.medical.backend.model.MedicalReport;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MedicalReportRepository extends MongoRepository<MedicalReport, String> {
}
