package android.example.hw9;

import android.app.Activity;
import android.media.Image;
import android.widget.ImageView;

import androidx.annotation.MainThread;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class GetWeatherData {

    private static final String TAG = GetWeatherData.class.getSimpleName();

    private static final String URL = "https://api.openweathermap.org/data/2.5/weather";
    private static final String WEATHER_TAG = "CURRENT_WEATHER";
    private static final String API_KEY = "7997bbf50ef2a736b72aceed269f0589";

    private RequestQueue queue;

    public GetWeatherData(@NonNull final Activity activity) {
        queue = Volley.newRequestQueue(activity.getApplicationContext());
    }

    public interface CurrentWeatherCallback {
        @MainThread
        void onCurrentWeather(@NonNull final WeatherModel weatherModel);

        @MainThread
        void onError(@Nullable Exception exception);
    }

    public void getCurrentWeather(@NonNull final String locationName, @NonNull final CurrentWeatherCallback callback) {
        final String url = String.format("%s?q=%s&appId=%s&units=imperial", URL, locationName, API_KEY);
        StringRequest stringRequest = new StringRequest(Request.Method.GET, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            final JSONObject WeatherJSON = new JSONObject(response);
                            final JSONArray weather = WeatherJSON.getJSONArray("weather");
                            final JSONObject weatherCondition = weather.getJSONObject(0);
                            final String conditionName = weatherCondition.getString("main");
                            final int weatherImage = WeatherModelHelper.getWeatherImage(conditionName);
                            final String locationName = WeatherJSON.getString("name");
                            final double temperature = WeatherJSON.getJSONObject("main").getDouble("temp");
                            // Find a way to get the state here
                            final WeatherModel weatherModel = new WeatherModel(locationName,"TEMPORARY STATE" ,weatherImage, conditionName, temperature);
                            callback.onCurrentWeather(weatherModel);
                        } catch (JSONException e) {
                            callback.onError(e);
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                callback.onError(error);
            }
        });
        stringRequest.setTag(WEATHER_TAG);
        queue.add(stringRequest);
    }

    public void cancel() {
        queue.cancelAll(WEATHER_TAG);
    }
}
