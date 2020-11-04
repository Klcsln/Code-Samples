package android.example.hw9;

import android.media.Image;
import android.widget.ImageView;

public class WeatherModel {
    final String city;
    final String state;
    final int backgroundImage;
    final String summary;
    final double temperature;

    public WeatherModel(final String city,
                        final String state,
                        final int backgroundImage,
                        final String summary,
                        final double temperature) {
        this.city = city;
        this.state = state;
        this.backgroundImage = backgroundImage;
        this.summary = summary;
        this.temperature = temperature;
    }

    public String getCity() {
        return city;
    }

    public String getState(){
        return state;
    }

    public int getBackgroundImage() {
        return backgroundImage;
    }

    public String getSummary() {
        return summary;
    }

    public double getTemperature() {
        return temperature;
    }
}
