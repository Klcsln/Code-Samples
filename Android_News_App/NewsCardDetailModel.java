package android.example.hw9;

public class NewsCardDetailModel extends NewsCardModel {
    private String bodyText;
    public NewsCardDetailModel(String id, String cardImageUrl, String cardTitle, String cardSection, String cardDate, boolean cardBookmarked, String cardWebUrl, String bodyText) {
        super(id, cardImageUrl, cardTitle, cardSection, cardDate, cardBookmarked, cardWebUrl);
        this.bodyText = bodyText;
    }

    public String getBodyText() {
        return bodyText;
    }
}
