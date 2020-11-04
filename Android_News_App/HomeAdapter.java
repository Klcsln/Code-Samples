package android.example.hw9;

import android.annotation.SuppressLint;
import android.content.Context;
import android.media.Image;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.squareup.picasso.Picasso;

import java.lang.reflect.Array;
import java.util.ArrayList;

public class HomeAdapter extends RecyclerView.Adapter {

    private Context context;
    private ArrayList<NewsCardModel> card;
    private ArrayList<WeatherModel> weather_card;
    public int size = 0;
    private OnItemClickListener mListener;
    private OnItemLongClickListener mLongListener;

    public interface OnItemLongClickListener {
        void onItemLongClick(int position);
    }

    public void setOnItemLongClickListener(OnItemLongClickListener listener) {
        mLongListener = listener;
    }

    public interface OnItemClickListener {
        void onItemClick(int position);
    }

    public void setOnItemClickListener(OnItemClickListener listener) {
        mListener = listener;
    }



    public HomeAdapter(Context ct, ArrayList<NewsCardModel> cards, ArrayList<WeatherModel> weather_card){
        this.context = ct;
        this.card = cards;
        this.weather_card = weather_card;
        this.size = card.size();
    }

    @Override
    public int getItemViewType(int position) {
        if(position == 0){
            // Weather Card
            return 0;
        }
        // News card
        else return 1;
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(context);
        View view;
        if(viewType == 0) {
            view = inflater.inflate(R.layout.weather_card, parent, false);
            return new WeatherViewHolder(view);
        }
        else {
            view = inflater.inflate(R.layout.news_card, parent, false);
            return new NewsViewHolder(view);
        }
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
        if(position == 0){
            WeatherViewHolder weatherViewHolder = (WeatherViewHolder) holder;
            weatherViewHolder.backImage.setImageResource(weather_card.get(position).getBackgroundImage());
            weatherViewHolder.cityName.setText(weather_card.get(position).getCity());
            weatherViewHolder.stateName.setText(weather_card.get(position).getState());
            weatherViewHolder.temperature.setText(((int) weather_card.get(position).getTemperature()) + " \u2103" );
            weatherViewHolder.description.setText(weather_card.get(position).getSummary());
        } else{
            NewsViewHolder newsViewHolder = (NewsViewHolder) holder;
            newsViewHolder.cardTitle.setText(card.get(position).getCardTitle());
            newsViewHolder.cardDate.setText(card.get(position).getCardDate());
            newsViewHolder.cardSection.setText(" | " + card.get(position).getCardSection());
            if(card.get(position).getCardImageUrl() == "") {
                newsViewHolder.cardImage.setImageResource(R.drawable.guardian_logo);
            } else {
                Picasso.get().load(card.get(position).getCardImageUrl()).fit().centerCrop().into(newsViewHolder.cardImage);
            }
        }

    }

    @Override
    public int getItemCount() {
        return this.size;
    }

    class NewsViewHolder extends RecyclerView.ViewHolder {
        TextView cardTitle, cardDate, cardSection, cardText, cardLink;
        ImageView cardImage;
        public NewsViewHolder(@NonNull View itemView){
            super(itemView);
            cardTitle = itemView.findViewById(R.id.news_title);
            cardDate = itemView.findViewById(R.id.news_time);
            cardSection = itemView.findViewById(R.id.news_section);
            cardImage = itemView.findViewById(R.id.news_image);

            itemView.setOnLongClickListener(new View.OnLongClickListener() {
                @Override
                public boolean onLongClick(View v) {
                    if(mLongListener != null){
                        int position = getAdapterPosition();
                        if(position != RecyclerView.NO_POSITION){
                            mLongListener.onItemLongClick(position);
                        }
                    }
                    return true;
                }
            });

            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if(mListener != null){
                        int position = getAdapterPosition();
                        if(position != RecyclerView.NO_POSITION ) {
                            mListener.onItemClick(position);
                        }
                    }
                }
            });
        }
    }

    class WeatherViewHolder extends RecyclerView.ViewHolder {
        TextView cityName, stateName, temperature, description;
        ImageView backImage;
        public WeatherViewHolder(@NonNull View itemView){
            super(itemView);
            cityName = itemView.findViewById(R.id.card_city_name);
            stateName = itemView.findViewById(R.id.card_state_name);
            temperature = itemView.findViewById(R.id.card_temperature);
            description = itemView.findViewById(R.id.card_desc);
            backImage = itemView.findViewById(R.id.weather_background);
        }
    }




}
