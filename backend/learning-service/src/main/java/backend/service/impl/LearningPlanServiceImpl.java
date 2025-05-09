package backend.service.impl;

import backend.model.LearningPlan;
import backend.repository.LearningPlanRepository;
import backend.service.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class LearningPlanServiceImpl implements LearningPlanService {

    private final LearningPlanRepository learningPlanRepository;

    @Autowired
    public LearningPlanServiceImpl(LearningPlanRepository learningPlanRepository) {
        this.learningPlanRepository = learningPlanRepository;
    }

    @Override
    public List<LearningPlan> getAllLearningPlans() {
        return learningPlanRepository.findAll();
    }

    @Override
    public LearningPlan createLearningPlan(LearningPlan learningPlan) {
        learningPlan.setCreatedAt(LocalDateTime.now());
        learningPlan.setUpdatedAt(LocalDateTime.now());
        if (learningPlan.getStatus() == null) {
            learningPlan.setStatus("ACTIVE");
        }
        return learningPlanRepository.save(learningPlan);
    }

    @Override
    public Optional<LearningPlan> getLearningPlanById(Long id) {
        return learningPlanRepository.findById(id);
    }

    @Override
    public LearningPlan updateLearningPlan(Long id, LearningPlan learningPlan) {
        Optional<LearningPlan> existingPlanOpt = learningPlanRepository.findById(id);
        
        if (existingPlanOpt.isPresent()) {
            LearningPlan existingPlan = existingPlanOpt.get();
            existingPlan.setTitle(learningPlan.getTitle());
            existingPlan.setDescription(learningPlan.getDescription());
            existingPlan.setTargetCompletionDate(learningPlan.getTargetCompletionDate());
            existingPlan.setStatus(learningPlan.getStatus());
            existingPlan.setUpdatedAt(LocalDateTime.now());
            
            return learningPlanRepository.save(existingPlan);
        } else {
            throw new RuntimeException("Learning plan not found with id: " + id);
        }
    }

    @Override
    public void deleteLearningPlan(Long id) {
        learningPlanRepository.deleteById(id);
    }

    @Override
    public List<LearningPlan> getLearningPlansByStatus(String status) {
        return learningPlanRepository.findByStatus(status);
    }

    @Override
    public List<LearningPlan> searchLearningPlansByTitle(String title) {
        return learningPlanRepository.findByTitleContainingIgnoreCase(title);
    }
}
