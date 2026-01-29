package com.eventsphere.service;

import com.eventsphere.entity.Event;
import com.eventsphere.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    private final EventRepository repo;

    public EventService(EventRepository repo) {
        this.repo = repo;
    }

    public List<Event> getAllEvents() {
        return repo.findAll();
    }

    public Event addEvent(Event event) {
        return repo.save(event);
    }
}
