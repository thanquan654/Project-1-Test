package com.project1.mood_diary.controller;


import com.project1.mood_diary.dto.request.LoginRequest;
import com.project1.mood_diary.entity.UserEntity;
import com.project1.mood_diary.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<UserEntity> login(@RequestBody LoginRequest loginRequest) {
//        UserEntity user = new  UserEntity();
//        user.setEmail(loginRequest.getEmail());
//        user.setPassword(loginRequest.getPassword());
//        user.setFullname("hdgjkadf");
//        userRepository.save(user);
        if (!userRepository.existsByEmail(loginRequest.getEmail())) {
            throw new RuntimeException("Email không tồn tại hoặc không đúng định dạng");
        }
        UserEntity  userEntity = userRepository.findByEmail(loginRequest.getEmail());
        if(!userEntity.getPassword().equals(loginRequest.getPassword())) {
            throw new RuntimeException("Mật khẩu rỗng hoặc không chính xác hoặc");

        }
     return ResponseEntity.ok(userEntity);
    }
}