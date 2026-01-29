package com.eventsphere.controller;

import com.eventsphere.dto.RegisterEventRequest;
import com.eventsphere.entity.Event;
import com.eventsphere.entity.RegisteredEvent;
import com.eventsphere.repository.EventRepository;
import com.eventsphere.repository.RegisteredEventRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/registeredEvents")
public class RegisteredEventController {

    private final RegisteredEventRepository registeredRepo;
    private final EventRepository eventRepo;

    public RegisteredEventController(
            RegisteredEventRepository registeredRepo,
            EventRepository eventRepo) {
        this.registeredRepo = registeredRepo;
        this.eventRepo = eventRepo;
    }

    /* ================= REGISTER EVENT ================= */
    @PostMapping
    @Transactional
    public RegisteredEvent register(@RequestBody RegisterEventRequest req) {

        String userEmail =
                SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getName();

        // ❌ Duplicate registration
        if (registeredRepo.existsByEventIdAndUserEmail(req.getEventId(), userEmail)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "You have already registered for this event"
            );
        }

        // 🔒 Lock event row
        Event event = eventRepo.findByIdForUpdate(req.getEventId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Event not found"
                ));

        // ❌ No slots
        if (event.getAvailableSlots() <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "No slots available"
            );
        }

        // ✅ Decrease slot
        event.setAvailableSlots(event.getAvailableSlots() - 1);
        eventRepo.save(event);

        // ✅ Save registration
        RegisteredEvent registered = new RegisteredEvent();
        registered.setEventId(event.getId());
        registered.setName(event.getName());
        registered.setLocation(event.getLocation());
        registered.setDate(event.getDate().toString());
        registered.setTime(event.getTime());
        registered.setPrice(event.getPrice());
        registered.setUserEmail(userEmail);

        return registeredRepo.save(registered);
    }

    /* ================= MY EVENTS ================= */
    @GetMapping
    public List<RegisteredEvent> myEvents() {

        String userEmail =
                SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getName();

        return registeredRepo.findByUserEmail(userEmail);
    }
}
