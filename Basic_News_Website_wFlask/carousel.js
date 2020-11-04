var url = "/carousel"
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      jsonData = JSON.parse(xhttp.responseText);
    }
};
xhttp.open("GET", url, false);
xhttp.send();

var slideArray = jsonData.articles.slice(0,5);

html_text = '';
for(i=0;i<slideArray.length;i++){
    html_text += '<div class="mySlides fade">';
    html_text += "<a target='_blank' href='" + slideArray[i].url + "'>";
    html_text += "<img src='"+ slideArray[i].urlToImage + "' alt='Avatar' style='width:100%; width:500px; height: 300px; object-fit: cover;'>";
    html_text += '<div class="text">';
    html_text += '<p style="font-weight: 900; font-size:18px; margin-bottom:-10px; line-height:1.3;">' + slideArray[i].title + "</p>";
    html_text += '<p style="font-size:12px;">' + slideArray[i].description + "</p></div></a></div>";
}   

document.getElementById('slideshow').innerHTML = html_text;

var slideIndex = 0;
function showSlides() {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}
  slides[slideIndex-1].style.display = "block";
  setTimeout(showSlides, 2000);
}

showSlides();

