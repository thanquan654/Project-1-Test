package com.project1.mood_diary.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class UserEntity extends BaseEntity {

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = true)
    private String password;  // null nếu provider = GOOGLE

//    @Enumerated(EnumType.STRING)
//    @Column(nullable = false)
//    private AuthProvider provider; // LOCAL, GOOGLE

    private String avatarUrl;

    private String providerId;

    @Column(nullable = false)
    private String fullname;


}
