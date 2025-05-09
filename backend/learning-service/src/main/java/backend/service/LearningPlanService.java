package backend.service;

import backend.model.LearningPlan;

import java.util.List;
import java.util.Optional;

public interface LearningPlanService {
    List<LearningPlan> getAllLearningPlans();
    LearningPlan createLearningPlan(LearningPlan learningPlan);
    Optional<LearningPlan> getLearningPlanById(Long id);
    LearningPlan updateLearningPlan(Long id, LearningPlan learningPlan);
    void deleteLearningPlan(Long id);
    List<LearningPlan> getLearningPlansByStatus(String status);
    List<LearningPlan> searchLearningPlansByTitle(String title);
}
