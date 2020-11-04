package android.example.hw9;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.core.text.HtmlCompat;
import androidx.core.widget.NestedScrollView;
import androidx.recyclerview.widget.LinearLayoutManager;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.text.Html;
import android.text.method.LinkMovementMethod;
import android.util.Log;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.squareup.picasso.Picasso;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.time.LocalDateTime;

import static android.example.hw9.ui.home.HomeFragment.EXTRA_ID;
import static android.example.hw9.ui.home.HomeFragment.EXTRA_IMG;

public class DetailActivity extends AppCompatActivity {
    String BASE_URL = "https://hw8-nodeserver-571.wl.r.appspot.com/api/g-detail/?id=";
    private RequestQueue requestQueue;
    private ProgressBar spinner;
    private TextView spinnerText;
    private NewsCardDetailModel newsModel;
    private String imgUrl;
    private TextView titleView, sectionView, dateView, descriptionView, linkView;
    private ImageView imageView;
    private NestedScrollView detailView;
    private LocalDateTime date;
    private String cardWebUrl;

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // handle arrow click here
        if (item.getItemId() == android.R.id.home) {
            finish(); // close this activity and return to preview activity (if there is any)
        }

        if(item.getItemId() == R.id.detail_twitter){
            String url = "https://twitter.com/intent/tweet/?text=Check%20out%20this%20link!%20" + cardWebUrl + "&hashtags=CSCI571NewsSearch";
            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setData(Uri.parse(url));
            startActivity(intent);
        }

        if(item.getItemId() == R.id.detail_bookmark){
            Toast.makeText(getBaseContext()," Bookmarked", Toast.LENGTH_LONG).show();
        }

        return super.onOptionsItemSelected(item);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.detail_menu, menu);
        return true;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        setTheme(R.style.AppTheme);
        super.onCreate(savedInstanceState);
        requestQueue = Volley.newRequestQueue(getBaseContext());
        setContentView(R.layout.detail_activity);

        Toolbar toolbar = findViewById(R.id.detail_toolbar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setTitle("Detail Section");
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setDisplayShowHomeEnabled(true);

        detailView = findViewById(R.id.scroll_view);

        detailView.setVisibility(View.GONE);
        spinner = findViewById(R.id.progressDetailBar);
        spinnerText = findViewById(R.id.spinnerDetailText);
        spinner.setVisibility(View.VISIBLE);
        spinnerText.setVisibility(View.VISIBLE);

        Intent intent = getIntent();
        String id = intent.getStringExtra(EXTRA_ID);

        imgUrl = intent.getStringExtra(EXTRA_IMG);
        imageView = findViewById(R.id.detail_image);
        titleView = findViewById(R.id.detail_title);
        sectionView = findViewById(R.id.detail_section);
        dateView = findViewById(R.id.detail_date);
        descriptionView = findViewById(R.id.detail_text);
        linkView = findViewById(R.id.detail_link);

        parseNewsJSON(id);
    }

    private void parseNewsJSON(final String id){
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, BASE_URL + id, null, new Response.Listener<JSONObject>() {
            @RequiresApi(api = Build.VERSION_CODES.O)
            @Override
            public void onResponse(JSONObject response) {
                try {
                    JSONObject jsonResults = response.getJSONObject("response");
                    String cardImageUrl = imgUrl;
                    String cardTitle = jsonResults.getJSONObject("content").getString("webTitle");
                    getSupportActionBar().setTitle(cardTitle);
                    date = LocalDateTime.parse(jsonResults.getJSONObject("content").getString("webPublicationDate").substring(0,19));
                    String cardDate = date.getDayOfMonth() + " " + date.getMonth().toString().substring(0, 1) + date.getMonth().toString().substring(1).toLowerCase() + " " + date.getYear();
                    String cardSection = jsonResults.getJSONObject("content").getString("sectionName");
                    cardWebUrl = jsonResults.getJSONObject("content").getString("webUrl");
                    String link = "<a href=\"" + cardWebUrl + "\">View Full Article</a>";
                    JSONArray cardTextArray = jsonResults.getJSONObject("content").getJSONObject("blocks").getJSONArray("body");
                    String cardText = "";
                    for(int i = 0; i < cardTextArray.length(); i++) {
                       cardText += cardTextArray.getJSONObject(i).getString("bodyHtml");
                    }
                    newsModel = new NewsCardDetailModel(id,cardImageUrl,cardTitle, cardSection, cardDate, false, cardWebUrl, cardText);
                    Picasso.get()
                            .load(cardImageUrl)
                            .placeholder(R.drawable.guardian_logo)
                            .fit()
                            .centerCrop()
                            .into(imageView);
                    titleView.setText(cardTitle);
                    dateView.setText(cardDate);
                    sectionView.setText(cardSection);
                    descriptionView.setText(HtmlCompat.fromHtml(cardText,0));
                    linkView.setText(Html.fromHtml(link, 0));
                    linkView.setMovementMethod(LinkMovementMethod.getInstance());

                    spinner.setVisibility(View.GONE);
                    spinnerText.setVisibility(View.GONE);
                    detailView.setVisibility(View.VISIBLE);

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
}
