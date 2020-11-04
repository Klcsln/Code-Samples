package android.example.hw9;

import android.example.hw9.R;
import android.widget.ImageView;

import androidx.annotation.DrawableRes;

public class WeatherModelHelper {
    @DrawableRes
    public static int getWeatherImage(final String weatherCondition) {
        switch (weatherCondition) {
            case "Clouds":
                return R.drawable.cloudy_weather;
            case "Clear":
                return R.drawable.clear_weather;
            case "Snow":
                return R.drawable.snowy_weather;
            case "Rain" :
            case "Drizzle":
                return R.drawable.rainy_weather;
            case "Thunderstorm":
                return R.drawable.thunder_weather;
            default:
                return R.drawable.sunny_weather;
        }
    }
}
