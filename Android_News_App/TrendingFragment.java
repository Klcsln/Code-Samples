package android.example.hw9.ui.trending;

import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
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

import android.example.hw9.R;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.github.mikephil.charting.charts.LineChart;
import com.github.mikephil.charting.components.Legend;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.github.mikephil.charting.highlight.Highlight;
import com.github.mikephil.charting.interfaces.datasets.ILineDataSet;
import com.github.mikephil.charting.listener.ChartTouchListener;
import com.github.mikephil.charting.listener.OnChartGestureListener;
import com.github.mikephil.charting.listener.OnChartValueSelectedListener;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Array;
import java.util.ArrayList;

public class TrendingFragment extends Fragment {

    private TrendingViewModel trendingViewModel;
    private LineChart lineChart;
    private RequestQueue requestQueue;
    private ArrayList<Entry> yValues;
    private ProgressBar spinner;
    private TextView spinnerText, searchInfo;
    private EditText editText;

    @Override
    public void onCreateOptionsMenu(Menu menu, MenuInflater inflater) {
        // TODO Add your menu entries here
        super.onCreateOptionsMenu(menu, inflater);
        inflater.inflate(R.menu.home_menu, menu);
    }

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_trending, container, false);
        setHasOptionsMenu(true);
        Toolbar toolbar = root.findViewById(R.id.trending_toolbar);
        ((AppCompatActivity) getActivity()).setSupportActionBar(toolbar);
        ((AppCompatActivity) getActivity()).getSupportActionBar().setTitle("NewsApp");
        requestQueue = Volley.newRequestQueue(getContext());

        spinner = root.findViewById(R.id.progressBar);
        spinnerText = root.findViewById(R.id.spinnerText);
        searchInfo = root.findViewById(R.id.trending_search_info);
        editText = root.findViewById(R.id.trending_search_query);
        lineChart = root.findViewById(R.id.line_chart);
        spinner.setVisibility(View.VISIBLE);
        spinnerText.setVisibility(View.VISIBLE);
        searchInfo.setVisibility(View.GONE);
        editText.setVisibility(View.GONE);
        lineChart.setVisibility(View.GONE);

        editText.setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                if ((event.getAction() == KeyEvent.ACTION_DOWN) &&
                        (keyCode == KeyEvent.KEYCODE_ENTER)) {
                    // Perform action on key press
                    spinner.setVisibility(View.VISIBLE);
                    spinnerText.setVisibility(View.VISIBLE);
                    searchInfo.setVisibility(View.GONE);
                    editText.setVisibility(View.GONE);
                    lineChart.setVisibility(View.GONE);
                    getJsonData("https://hw8-nodeserver-571.wl.r.appspot.com/api/g-trending/?search=" + editText.getText(), "" + editText.getText());
                    //return true;
                }
                return false;
            }
        });

        yValues = new ArrayList<>();
        getJsonData("https://hw8-nodeserver-571.wl.r.appspot.com/api/g-trending/?search=coronavirus", "Coronavirus");



        return root;
    }

    private void getJsonData(String url, final String  search){
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, url, null, new Response.Listener<JSONObject>() {
            @RequiresApi(api = Build.VERSION_CODES.O)
            @Override
            public void onResponse(JSONObject response) {
                try {
                    yValues.clear();
                    JSONArray jsonResults = response.getJSONObject("default").getJSONArray("timelineData");
                    for(int i = 0; i < jsonResults.length(); i++){
                        int value = (int) jsonResults.getJSONObject(i).getJSONArray("value").get(0);
                        Entry entry = new Entry((float) i, value );
                        yValues.add(entry);
                    }
                    drawChart(search);
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

    private void drawChart(String search){

        Legend legend = lineChart.getLegend();

        LineDataSet set1 = new LineDataSet(yValues, "Trending chart for " + search);

        set1.setFillAlpha(110);
        set1.setColor(Color.MAGENTA);
        set1.setCircleColor(Color.MAGENTA);

        lineChart.getAxisLeft().setDrawGridLines(false);
        lineChart.getAxisRight().setDrawGridLines(false);
        lineChart.getXAxis().setDrawGridLines(false);

        ArrayList<ILineDataSet> dataSets = new ArrayList<>();
        dataSets.add(set1);

        legend.setEnabled(true);
        legend.setTextColor(Color.BLACK);
        legend.setTextSize(16.0f);

        LineData data = new LineData(dataSets);
        lineChart.setData(data);

        spinner.setVisibility(View.GONE);
        spinnerText.setVisibility(View.GONE);
        searchInfo.setVisibility(View.VISIBLE);
        editText.setVisibility(View.VISIBLE);
        lineChart.setVisibility(View.VISIBLE);
    }
}
