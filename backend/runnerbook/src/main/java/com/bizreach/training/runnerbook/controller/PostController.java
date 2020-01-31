package com.bizreach.training.runnerbook.controller;


import com.bizreach.training.runnerbook.exception.ResourceNotFoundException;
import com.bizreach.training.runnerbook.model.Post;
import com.bizreach.training.runnerbook.payload.ApiResponse;
import com.bizreach.training.runnerbook.repository.PostRepository;
import com.bizreach.training.runnerbook.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.List;

@RestController
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/users/{userId}/posts")
    public List<Post> getAllPostsByUserId(@PathVariable (value = "userId") Long userId) {
        return postRepository.findByUserId(userId);
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/users/{userId}/posts")
    public Post createPost(@PathVariable(value = "userId") Long userId,
                               @Valid @RequestBody Post post) throws ResourceNotFoundException {
        return userRepository.findById(userId).map(user -> {
                post.setUser(user);
        return postRepository.save(post);
        }).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @PreAuthorize("hasRole('USER')")
    @PutMapping("/users/{userId}/posts/{postId}")
    public Post updatePost(@PathVariable (value = "userId") Long userId,
                                 @PathVariable (value = "postId") Long postId,
                                 @Valid @RequestBody Post postRequest) {
        if(!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("UserId " + userId + " not found");
        }

        return postRepository.findByIdAndUserId(postId,userId).map(post -> {
            post.setTitle(postRequest.getTitle());
            post.setContent(postRequest.getContent());
            return postRepository.save(post);
        }).orElseThrow(() -> new ResourceNotFoundException("Post Id " + postId + "not found"));
    }

    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/users/{userId}/posts/{postsId}")
    public ResponseEntity<?> deletePost(@PathVariable (value = "userId") Long userId,
                                           @PathVariable (value = "postsId") Long postsId) {
        return postRepository.findByIdAndUserId(postsId, userId).map(post -> {
            postRepository.delete(post);
            URI location = ServletUriComponentsBuilder
                    .fromCurrentContextPath().path("/users/{userId}/posts/{postId}")
                    .buildAndExpand(userId, postsId).toUri();
            return ResponseEntity.created(location).body(new ApiResponse(true, "Post deleted successfully"));
        }).orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId + " and postId " + postsId));
    }

}
