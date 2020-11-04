from flask import Flask, jsonify, current_app, make_response, request
from newsapi import NewsApiClient
from collections import Counter
from json import dumps
import json
import mimetypes

mimetypes.add_type('text/javascript', '.js')

newsapi = NewsApiClient(api_key="b551aca9e7074a0580090dc79c9f0335")

application = Flask(__name__)

@application.route('/')
def index():
    return current_app.send_static_file('index.html')

@application.route('/formSubmit', methods=["GET","POST"])
def formSubmit():
    if request.method == "POST":
        keyword = request.args.get('keyword')
        dateFrom = request.args.get('dateFrom')
        dateTo = request.args.get('dateTo')
        source = request.args.get('source')
        if(source == "all"):
            sources = (newsapi.get_sources(language='en',country='us'))["sources"]
            source = ','.join([x['id'] for x in sources])
        query = clean_response(newsapi.get_everything(q=keyword, sources=source, from_param=dateFrom, to=dateTo, language='en',sort_by='publishedAt', page_size=30))
    return jsonify(query)

@application.route('/sources')
def sources():
    sources = newsapi.get_sources(language='en',country='us')
    return jsonify(sources)

@application.route('/carousel')
def carousel():
    top_headlines = clean_response(newsapi.get_top_headlines(page_size=20))
    return jsonify(top_headlines)

@application.route('/cnn')
def cnn():
    top_headlines = clean_response(newsapi.get_top_headlines(page_size=20, sources='cnn'))
    return jsonify(top_headlines)

@application.route('/fox')
def fox():
    top_headlines = clean_response(newsapi.get_top_headlines(page_size=20, sources='fox-news'))
    return jsonify(top_headlines)

@application.route('/frequent')
def frequent():
    top_headlines = newsapi.get_top_headlines(page_size=100)
    return jsonify((top30(top_headlines)))
    
def top30(top_headlines):
    frequent_words = list()
    for i in range(len(top_headlines["articles"])):
        split_words = top_headlines["articles"][i]["title"].split()    
        for j in split_words:
            frequent_words.append(j.lower())
    with open("stopwords_en.txt", "r") as file:
        data = file.read()
        stop_words = data.split()
    frequent_words_clean = [x for x in frequent_words if x not in stop_words]
    counter = Counter(frequent_words_clean)
    most_commons = counter.most_common(30)
    return most_commons

def clean_response(top_headlines):
    for index, item in enumerate(top_headlines["articles"]):
        for title in item:
            # This is the weirdest bugfix I've ever done
            if(item['author'] is None):
                top_headlines['articles'].pop(index)
                break
            if(item[title] == 'null' or item[title] == ''  or item[title] is None):
                top_headlines["articles"].pop(index)
            if(item[title] == 'source'):
                if((not item[title]['source']['name']) or (item[title]['source']['name'] == 'null') or (item[title]['source']['name'] == '')):
                    top_headlines["articles"].pop(index)
    return top_headlines

if __name__ == '__main__':
    application.run()