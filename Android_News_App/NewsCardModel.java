package android.example.hw9;

import java.time.LocalDate;
import java.util.Date;

public class NewsCardModel {
    private final String id, cardImageUrl, cardTitle, cardSection, cardDate, cardWebUrl;
    private final boolean cardBookmarked;

    public NewsCardModel(String id, String cardImageUrl, String cardTitle,  String cardSection, String cardDate, boolean cardBookmarked, String cardWebUrl) {
        this.id = id;
        this.cardImageUrl = cardImageUrl;
        this.cardTitle = cardTitle;
        this.cardSection = cardSection;
        this.cardDate = cardDate;
        this.cardBookmarked = cardBookmarked;
        this.cardWebUrl = cardWebUrl;
    }

    public String getId() { return id; }

    public String getCardImageUrl() {
        return cardImageUrl;
    }

    public String getCardTitle() {
        return cardTitle;
    }

    public String getCardSection() {
        return cardSection;
    }

    public String getCardDate() {
        return cardDate;
    }

    public boolean getCardBookmarked(){
        return cardBookmarked;
    }

    public String getCardWebUrl() { return cardWebUrl; }

}
