package android.example.hw9.ui.headlines;

import android.app.Dialog;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.example.hw9.DetailActivity;
import android.example.hw9.HeadlinesAdapter;
import android.example.hw9.HomeAdapter;
import android.example.hw9.NewsCardModel;
import android.example.hw9.WeatherModel;
import android.example.hw9.WeatherModelHelper;
import android.example.hw9.ui.home.HomeFragment;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProviders;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import android.example.hw9.R;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.OnSuccessListener;
import com.squareup.picasso.Picasso;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import static android.Manifest.permission.ACCESS_FINE_LOCATION;

public class HeadlinesFragment extends Fragment implements HeadlinesAdapter.OnItemClickListener, HeadlinesAdapter.OnItemLongClickListener {

    public static final String EXTRA_ID = "extra_id";
    public static final String EXTRA_IMG = "extra_img";
    private RecyclerView homeRecyclerView;
    private HeadlinesAdapter headlinesAdapter;
    private ArrayList<NewsCardModel> newsCards = new ArrayList<>();
    private ArrayList<WeatherModel> weather_card = new ArrayList<>();
    private RequestQueue requestQueue;
    private ProgressBar spinner;
    private TextView spinnerText;
    private SwipeRefreshLayout swipeRefreshLayout;
    private ImageView dialogImage, dialogTwitter, dialogBookmark;
    private TextView dialogTitle;
    private Dialog dialog;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestQueue = Volley.newRequestQueue(getContext());
        setHasOptionsMenu(true);

    }

    @Override
    public void onCreateOptionsMenu(Menu menu, MenuInflater inflater) {
        // TODO Add your menu entries here
        super.onCreateOptionsMenu(menu, inflater);
        inflater.inflate(R.menu.home_menu, menu);
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_headlines, container, false);

        Toolbar toolbar = root.findViewById(R.id.home_toolbar);
        ((AppCompatActivity) getActivity()).setSupportActionBar(toolbar);
        ((AppCompatActivity) getActivity()).getSupportActionBar().setTitle("NewsApp");


        spinner = root.findViewById(R.id.progressBar);
        spinnerText = root.findViewById(R.id.spinnerText);
        spinner.setVisibility(View.VISIBLE);
        spinnerText.setVisibility(View.VISIBLE);

        swipeRefreshLayout = root.findViewById(R.id.swipe_refresh);
        swipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                spinner.setVisibility(View.VISIBLE);
                spinnerText.setVisibility(View.VISIBLE);
                parseNewsJSON("https://hw8-nodeserver-571.wl.r.appspot.com/api/g-search/?search=world");
                headlinesAdapter.notifyDataSetChanged();
                swipeRefreshLayout.setRefreshing(false);
            }
        });

        dialog = new Dialog(root.getContext());
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setContentView(R.layout.news_dialog);

        homeRecyclerView = root.findViewById(R.id.home_recycler_view);
        homeRecyclerView.setHasFixedSize(true);
        parseNewsJSON("https://hw8-nodeserver-571.wl.r.appspot.com/api/g-search/?search=world");
        //"https://hw8-nodeserver-571.wl.r.appspot.com/api/g-search/?search=world";
        return root;
    }

    private void parseNewsJSON(String url){
        if(headlinesAdapter != null) {
            newsCards.clear();
            headlinesAdapter = new HeadlinesAdapter(getContext(),  newsCards, weather_card);
            homeRecyclerView.setAdapter(headlinesAdapter);
            homeRecyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        }
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, url, null, new Response.Listener<JSONObject>() {
            @RequiresApi(api = Build.VERSION_CODES.O)
            @Override
            public void onResponse(JSONObject response) {
                try {
                    JSONArray jsonResults = response.getJSONObject("response").getJSONArray("results");
                    for(int i=0; i< jsonResults.length(); i++){
                        String cardImageUrl;
                        JSONObject result = jsonResults.getJSONObject(i);
                        Log.v("---------",result.getJSONObject("blocks").toString());
                        String id = result.getString("id");
                        if(result.getJSONObject("blocks").has("main")){
                            JSONObject images = (JSONObject) result.getJSONObject("blocks").getJSONObject("main").getJSONArray("elements").get(0);
                            JSONObject image = (JSONObject) images.getJSONArray("assets").get(0);
                            cardImageUrl = image.getString("file");

                        } else {
                            cardImageUrl = "";
                        }

                        String cardTitle = result.getString("webTitle");
                        String cardSection = result.getString("sectionName");
                        String cardWebUrl = result.getString("webUrl");
                        String cardDate = getTimeAgo(result.getString("webPublicationDate").substring(0,19));
                        newsCards.add(new NewsCardModel(id,cardImageUrl,cardTitle, cardSection, cardDate, false, cardWebUrl));
                    }
                    spinner.setVisibility(View.GONE);
                    spinnerText.setVisibility(View.GONE);
                    headlinesAdapter = new HeadlinesAdapter(getContext(),  newsCards, weather_card);
                    homeRecyclerView.setAdapter(headlinesAdapter);
                    headlinesAdapter.setOnItemClickListener(HeadlinesFragment.this);
                    headlinesAdapter.setOnItemLongClickListener(HeadlinesFragment.this);
                    homeRecyclerView.setLayoutManager(new LinearLayoutManager(getContext()));

                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                error.printStackTrace();
            }
        });
        requestQueue.add(request);
    }


    @RequiresApi(api = Build.VERSION_CODES.O)
    public String getTimeAgo(String cardDate) {
        LocalDateTime dateTime = LocalDateTime.parse(cardDate.substring(0,19));
        LocalDateTime dateTime2 = LocalDateTime.now();
        long diffInHours, diffInMinutes, diffInSeconds;
        if(dateTime.isAfter(dateTime2)){
            diffInSeconds = ChronoUnit.SECONDS.between(dateTime2, dateTime);
            diffInMinutes = ChronoUnit.MINUTES.between(dateTime2, dateTime);
            diffInHours = ChronoUnit.HOURS.between(dateTime2, dateTime);
        } else {
            diffInSeconds = ChronoUnit.SECONDS.between(dateTime, dateTime2);
            diffInMinutes = ChronoUnit.MINUTES.between(dateTime, dateTime2);
            diffInHours = ChronoUnit.HOURS.between(dateTime, dateTime2);
        }

        if(diffInHours > 1) {
            return diffInHours + "h ago";
        } else if(diffInMinutes > 1) {
            return diffInMinutes + "m ago";
        } else {
            return diffInSeconds + "s ago";
        }
    }



    public void onItemClick(int position) {
        Intent detailIntent = new Intent(getContext(), DetailActivity.class);
        detailIntent.putExtra(EXTRA_ID, newsCards.get(position).getId());
        detailIntent.putExtra(EXTRA_IMG, newsCards.get(position).getCardImageUrl());
        startActivity(detailIntent);
    }

    public void onItemLongClick(int position) {

        dialogImage = dialog.findViewById(R.id.dialog_image);
        dialogTwitter = dialog.findViewById(R.id.dialog_twitter);
        dialogBookmark = dialog.findViewById(R.id.dialog_bookmark);
        dialogTitle = dialog.findViewById(R.id.dialog_title);
        final String dialogUrl = newsCards.get(position).getCardWebUrl();
        final String title = newsCards.get(position).getCardTitle();
        dialogTwitter.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String url = "https://twitter.com/intent/tweet/?text=Check%20out%20this%20link!%20" + dialogUrl + "&hashtags=CSCI571NewsSearch";
                Intent intent = new Intent(Intent.ACTION_VIEW);
                intent.setData(Uri.parse(url));
                startActivity(intent);
            }
        });
        dialogBookmark.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogBookmark.setImageResource(R.drawable.ic_bookmark_black_24dp);
                Toast.makeText(getContext(),title + " was added to bookmarks", Toast.LENGTH_LONG).show();
            }
        });

        if(newsCards.get(position).getCardImageUrl() == "") {
            dialogImage.setImageResource(R.drawable.guardian_logo);
        } else {
            Picasso.get().load(newsCards.get(position).getCardImageUrl()).fit().centerCrop().into(dialogImage);
        }
        dialogTitle.setText(newsCards.get(position).getCardTitle());

        dialog.show();
    }
}
