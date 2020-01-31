package com.bizreach.training.runnerbook.controller;


import com.bizreach.training.runnerbook.exception.ResourceNotFoundException;
import com.bizreach.training.runnerbook.model.Run;
import com.bizreach.training.runnerbook.model.User;
import com.bizreach.training.runnerbook.payload.ApiResponse;
import com.bizreach.training.runnerbook.repository.RunRepository;
import com.bizreach.training.runnerbook.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class RunController {

    @Autowired
    private RunRepository runRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/users/{userId}/runs")
    public List<Run> getAllRunsByUserId(@PathVariable (value = "userId") Long userId) {
        return userRepository.findById(userId).get().getRuns().stream().collect(Collectors.toList());
    }

    @GetMapping("/joinruns")
    public List<Run> getAllRuns() {
        return runRepository.findAll();
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/users/{userId}/runs")
    public Run createRun(@PathVariable(value = "userId") Long userId,
                           @Valid @RequestBody Run run) throws ResourceNotFoundException {
        return userRepository.findById(userId).map(user -> {
            run.getUsers().add(user);
            user.getRuns().add(run);
            return runRepository.save(run);
        }).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @PreAuthorize("hasRole('USER')")
    @PutMapping("/users/{userId}/runs/{runId}")
    public Run updateRun(@PathVariable (value = "userId") Long userId,
                           @PathVariable (value = "runId") Long runId,
                           @Valid @RequestBody Run runRequest) {
        if(!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("UserId " + userId + " not found");
        }

        return runRepository.findById(runId).map(run -> {
            run.getUsers().add(userRepository.findById(userId).get());
            run.setTitle(runRequest.getTitle());
            run.setLocation(runRequest.getLocation());
            run.setCreationDateTime(runRequest.getCreationDateTime());
            return runRepository.save(run);
        }).orElseThrow(() -> new ResourceNotFoundException("Run Id " + runId + "not found"));
    }


    @PreAuthorize("hasRole('USER')")
    @PutMapping("/users/{userId}/joinrun/{runId}")
    public Run joinRun(@PathVariable (value = "userId") Long userId,
                          @PathVariable (value = "runId") Long runId,
                          @Valid @RequestBody Run runRequest) {
        if(!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("UserId " + userId + " not found");
        }

        return runRepository.findById(runId).map(run -> {
            User user = userRepository.findById(userId).get();
            user.getRuns().add(run);
            run.getUsers().add(user);
            return runRepository.save(run);
        }).orElseThrow(() -> new ResourceNotFoundException("Post Id " + runId + "not found"));
    }

    @PreAuthorize("hasRole('USER')")
    @PutMapping("/users/{userId}/exitrun/{runId}")
    public Run exitRun(@PathVariable (value = "userId") Long userId,
                       @PathVariable (value = "runId") Long runId,
                       @Valid @RequestBody Run runRequest) {
        if(!runRepository.findById(runId).get().getUsers().stream().anyMatch(user -> user.getId().equals(userId)) ) {
            throw new ResourceNotFoundException("UserId " + userId + " not found" + "RunId "+ runId);
        }

        return runRepository.findById(runId).map(run -> {
            User user = userRepository.findById(userId).get();
            user.getRuns().remove(run);
            run.getUsers().remove(user);
            return runRepository.save(run);
        }).orElseThrow(() -> new ResourceNotFoundException("Post Id " + runId + "not found"));
    }

    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/runs/{runsId}")
    public ResponseEntity<?> deleteRun(@PathVariable Long runsId) {
        return runRepository.findById(runsId).map(run -> {
            runRepository.delete(run);
            URI location = ServletUriComponentsBuilder
                    .fromCurrentContextPath().path("/users/runs/{runsId}")
                    .buildAndExpand(runsId).toUri();
            return ResponseEntity.created(location).body(new ApiResponse(true, "Run event deleted successfully"));
        }).orElseThrow(() -> new ResourceNotFoundException("RunId " + runsId + " not found"));
    }
}
