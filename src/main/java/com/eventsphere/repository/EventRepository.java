package com.eventsphere.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.eventsphere.entity.Event;

import jakarta.persistence.LockModeType;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByNameContainingIgnoreCaseOrLocationContainingIgnoreCaseOrCategoryContainingIgnoreCase(
        String name,
        String location,
        String category
    );
    
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT e FROM Event e WHERE e.id = :id")
    Optional<Event> findByIdForUpdate(@Param("id") Long id);
}