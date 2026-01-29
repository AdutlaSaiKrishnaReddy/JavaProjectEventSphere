package com.eventsphere.controller;

import com.eventsphere.entity.Event;
import com.eventsphere.repository.EventRepository;
import com.eventsphere.service.EventService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
@CrossOrigin(origins = "*")
public class EventController {

    private final EventService service;
    private final EventRepository repo;

    public EventController(EventService service, EventRepository repo) {
        this.service = service;
        this.repo = repo;
    }

    // ---------------- GET ALL EVENTS ----------------
    @GetMapping
    public List<Event> getEvents() {
        return service.getAllEvents();
    }

    // ---------------- CREATE EVENT ----------------
    @PostMapping
    public Event addEvent(@RequestBody Event event) {

        normalizeEvent(event);
        return service.addEvent(event);
    }

    // ---------------- UPDATE EVENT ----------------
    @PutMapping("/{id}")
    public Event updateEvent(
            @PathVariable Long id,
            @RequestBody Event updatedEvent
    ) {
        Event existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // update fields
        existing.setName(updatedEvent.getName());
        existing.setMode(updatedEvent.getMode());
        existing.setLocation(updatedEvent.getLocation());
        existing.setDate(updatedEvent.getDate());
        existing.setTime(updatedEvent.getTime());
        existing.setPrice(updatedEvent.getPrice());
        existing.setCategory(updatedEvent.getCategory());
        existing.setImage(updatedEvent.getImage());
        existing.setDisplayPage(updatedEvent.getDisplayPage());
        existing.setDisplaySection(updatedEvent.getDisplaySection());
        existing.setTotalSlots(updatedEvent.getTotalSlots());

        // 🔐 keep availableSlots safe
        if (existing.getAvailableSlots() > updatedEvent.getTotalSlots()) {
            existing.setAvailableSlots(updatedEvent.getTotalSlots());
        }

        normalizeEvent(existing);

        return repo.save(existing);
    }

    // ---------------- DELETE EVENT ----------------
    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Event not found");
        }
        repo.deleteById(id);
    }

    // ---------------- SEARCH ----------------
    @GetMapping("/search")
    public List<Event> searchEvents(@RequestParam String q) {
        return repo
            .findByNameContainingIgnoreCaseOrLocationContainingIgnoreCaseOrCategoryContainingIgnoreCase(
                q, q, q
            );
    }

    // ---------------- COMMON NORMALIZATION ----------------
    private void normalizeEvent(Event event) {
        if (event.getMode() == null || event.getMode().isBlank()) {
            event.setMode("ONLINE");
        }

        if ("ONLINE".equalsIgnoreCase(event.getMode())) {
            event.setLocation("Online");
        }
    }
}
