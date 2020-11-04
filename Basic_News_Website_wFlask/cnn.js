var url = "/cnn"
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      jsonData = JSON.parse(xhttp.responseText);
    }
};
xhttp.open("GET", url, false);
xhttp.send();

var card_data = jsonData.articles.slice(0,4);

html_text = '';
for(i=0;i<card_data.length;i++){
    html_text += '<div class="card column">';
    html_text += "<a target='_blank' href='" + card_data[i].url + "'>";
    html_text += "<img src='"+ card_data[i].urlToImage + "' alt='Avatar' style='width:100%;'>";
    html_text += "<div class='container' style='line-height: 1.3;'>";
    html_text += "<h4><b style='font-weight: 900;'>" + card_data[i].title + "</b></h4>";
    html_text += "<p style='font-size:12px;'>" + card_data[i].description + "</p></div></a></div>"
}   

document.getElementById('cnn').innerHTML = html_text;
