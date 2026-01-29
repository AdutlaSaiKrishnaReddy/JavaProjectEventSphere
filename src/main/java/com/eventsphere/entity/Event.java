package com.eventsphere.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    @Column(nullable = false)
    private String mode = "ONLINE"; // ONLINE or OFFLINE

    public String getMode() {
		return mode;
	}

	public void setMode(String mode) {
		this.mode = mode;
	}

	private String location;

    private LocalDate date;

    private String time;

    private String category;

    private String price;

    @Column(columnDefinition = "TEXT")
    private String image;

    
    @Column(nullable = false)
    private int totalSlots;

    @Column(nullable = false)
    private int availableSlots;

    @Column(nullable = false)
    private String displayPage;

    @Column(nullable = false)
    private String displaySection;

    public int getTotalSlots() {
		return totalSlots;
	}

	public void setTotalSlots(int totalSlots) {
		this.totalSlots = totalSlots;
	}

	public int getAvailableSlots() {
		return availableSlots;
	}

	public void setAvailableSlots(int availableSlots) {
		this.availableSlots = availableSlots;
	}

	public String getDisplayPage() {
		return displayPage;
	}

	public void setDisplayPage(String displayPage) {
		this.displayPage = displayPage;
	}

	public String getDisplaySection() {
		return displaySection;
	}

	public void setDisplaySection(String displaySection) {
		this.displaySection = displaySection;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getPrice() {
		return price;
	}

	public void setPrice(String price) {
		this.price = price;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	
}
