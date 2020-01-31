package com.bizreach.training.runnerbook.controller;


import com.bizreach.training.runnerbook.exception.ResourceNotFoundException;
import com.bizreach.training.runnerbook.model.User;
import com.bizreach.training.runnerbook.payload.UserIdentityAvailability;
import com.bizreach.training.runnerbook.repository.UserRepository;
import com.bizreach.training.runnerbook.security.CurrentUser;
import com.bizreach.training.runnerbook.security.UserPrincipal;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
public class UserController {

    @Autowired
    private UserRepository userRepository;


    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/users/checkemailavailability")
    public UserIdentityAvailability checkEmailAvailability(@RequestParam(value = "email") String email) {
        Boolean isAvailable = !userRepository.existsByEmail(email);
        return new UserIdentityAvailability(isAvailable);
    }

    @GetMapping("/users/me")
    @PreAuthorize("hasRole('USER')")
    public User getCurrentUser(@CurrentUser UserPrincipal currentUser) {
        return userRepository.findById(currentUser.getId()).get();
    }

    @GetMapping("/users/email")
    public User getUserByEmail(@RequestParam(value = "email") String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.get();
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/users/{userId}")
    public User getOneUser(@PathVariable Long userId) {
        return userRepository.findById(userId).get();
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/users")
    public User createUser(@Valid @RequestBody User user) {
        BCryptPasswordEncoder  encoder = new  BCryptPasswordEncoder();
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @PreAuthorize("hasRole('USER')")
    @PutMapping("/users/{userId}")
    public User updateUser(@PathVariable Long userId, @Valid @RequestBody User userRequest) {
        return userRepository.findById(userId).map(user -> {
            user.setLocation(userRequest.getLocation());
            user.setAge(userRequest.getAge());
            user.setName(userRequest.getName());
                return userRepository.save(user);
        }).orElseThrow(() -> new ResourceNotFoundException("UserId " + userId + " not found"));
    }

    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        return userRepository.findById(userId).map(user -> {
            userRepository.delete(user);
            return ResponseEntity.ok().build();
        }).orElseThrow(() -> new ResourceNotFoundException("UserId " + userId + " not found"));
    }

}
