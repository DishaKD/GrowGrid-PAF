package backend.controller;

import backend.model.LearningPlan;
import backend.service.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/learning-plans")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true", 
    allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, 
    RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class LearningPlanController {

    private final LearningPlanService learningPlanService;

    @Autowired
    public LearningPlanController(LearningPlanService learningPlanService) {
        this.learningPlanService = learningPlanService;
    }

    @GetMapping
    public ResponseEntity<List<LearningPlan>> getAllLearningPlans() {
        List<LearningPlan> learningPlans = learningPlanService.getAllLearningPlans();
        return new ResponseEntity<>(learningPlans, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LearningPlan> getLearningPlanById(@PathVariable Long id) {
        Optional<LearningPlan> learningPlan = learningPlanService.getLearningPlanById(id);
        return learningPlan.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<LearningPlan> createLearningPlan(@RequestBody LearningPlan learningPlan) {
        LearningPlan newLearningPlan = learningPlanService.createLearningPlan(learningPlan);
        return new ResponseEntity<>(newLearningPlan, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningPlan> updateLearningPlan(@PathVariable Long id, @RequestBody LearningPlan learningPlan) {
        try {
            LearningPlan updatedLearningPlan = learningPlanService.updateLearningPlan(id, learningPlan);
            return new ResponseEntity<>(updatedLearningPlan, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLearningPlan(@PathVariable Long id) {
        learningPlanService.deleteLearningPlan(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<LearningPlan>> getLearningPlansByStatus(@PathVariable String status) {
        List<LearningPlan> learningPlans = learningPlanService.getLearningPlansByStatus(status);
        return new ResponseEntity<>(learningPlans, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<LearningPlan>> searchLearningPlans(@RequestParam String title) {
        List<LearningPlan> learningPlans = learningPlanService.searchLearningPlansByTitle(title);
        return new ResponseEntity<>(learningPlans, HttpStatus.OK);
    }
}
