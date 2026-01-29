package com.eventsphere.repository;

import com.eventsphere.entity.RegisteredEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RegisteredEventRepository
        extends JpaRepository<RegisteredEvent, Long> {

    boolean existsByEventIdAndUserEmail(Long eventId, String userEmail);

    List<RegisteredEvent> findByUserEmail(String userEmail);
}
