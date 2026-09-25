package com.cycleshop.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class StockIntakeRequest {

    @NotNull(message = "Incoming quantity is required")
    @Min(value = 1, message = "Incoming quantity must be at least 1")
    private Integer incomingQuantity;

    private String notes;

    public StockIntakeRequest() {
    }

    public StockIntakeRequest(Integer incomingQuantity, String notes) {
        this.incomingQuantity = incomingQuantity;
        this.notes = notes;
    }

    public Integer getIncomingQuantity() {
        return incomingQuantity;
    }

    public void setIncomingQuantity(Integer incomingQuantity) {
        this.incomingQuantity = incomingQuantity;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
