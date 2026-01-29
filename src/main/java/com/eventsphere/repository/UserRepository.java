package com.eventsphere.repository;

import com.eventsphere.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // find user by email (used in signup & login)
    Optional<User> findByEmail(String email);
}
