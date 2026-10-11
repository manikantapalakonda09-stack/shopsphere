package com.shopsphere.dto;

import java.util.List;

public class AiDescriptionResponse {
    private String suggestedTitle;
    private String description;
    private List<String> highlights;
    private List<String> searchKeywords;
    private String tone;

    public AiDescriptionResponse() {}

    public AiDescriptionResponse(String suggestedTitle, String description, List<String> highlights, List<String> searchKeywords, String tone) {
        this.suggestedTitle = suggestedTitle;
        this.description = description;
        this.highlights = highlights;
        this.searchKeywords = searchKeywords;
        this.tone = tone;
    }

    public String getSuggestedTitle() { return suggestedTitle; }
    public void setSuggestedTitle(String suggestedTitle) { this.suggestedTitle = suggestedTitle; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getHighlights() { return highlights; }
    public void setHighlights(List<String> highlights) { this.highlights = highlights; }

    public List<String> getSearchKeywords() { return searchKeywords; }
    public void setSearchKeywords(List<String> searchKeywords) { this.searchKeywords = searchKeywords; }

    public String getTone() { return tone; }
    public void setTone(String tone) { this.tone = tone; }
}
