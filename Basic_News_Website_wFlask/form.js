function getSources(){
    var url = "/sources"
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      sources = JSON.parse(xhttp.responseText);
    }
};
    xhttp.open("GET", url, false);
    xhttp.send();

    sourceList = [];
    tmp = document.getElementById("category");
    // Get the selected category value
    category = tmp.options[tmp.selectedIndex].value;

    // Add the source to sourcelist if the category matches or if the category is all
    sources.sources.forEach(function(item){
        if(item.category == category || category == "all"){
            sourceList.push([item.name,item.id]);
        }
    })
    // Clear source list
    var placementNode = document.getElementById('source');
    placementNode.innerHTML =  "";

    // Create new source list based on category
    html_text = "<option value='all' id='allSources'>all</option>"
    sourceList.forEach(function(source){
        html_text += "<option value='" + source[1] + "'>" + source[0] + "</option>";
    })
    // Place the sources into the dropdown list
    var placementNode = document.getElementById('source');
    placementNode.innerHTML =  html_text;

}

function clearForm(){

    document.getElementById("keyword").value = "";
    var date = new Date();
    datePlaceHolder(date,"dateTo");
    date.setDate(date.getDate() - 7)
    datePlaceHolder(date,"dateFrom");
    document.getElementById("category").value = "all";
    document.getElementById("source").innerHTML ='<option value="all" selected id="allSources">all</option>';
    document.getElementById("source").value = "all";
}

const searchForm = document.getElementById("searchForm");

searchForm.addEventListener('submit',function(e){
    e.preventDefault();
    var formData = new FormData(searchForm);
    let d1 = new Date(formData.get('dateFrom'));
    let d2 = new Date(formData.get('dateTo'));

    if( d1 > d2) {
        alert("Invalid date! Please enter a valid date range");
        return;
    }

    const searchParams = new URLSearchParams();
    for (const pair of formData) {
        searchParams.append(pair[0], pair[1]);
    }
    const paramUrl = searchParams.toString();

    fetch('/formSubmit?' + paramUrl, {
        method: 'POST'
    }).then(res => res.json())
    .then(data => searchResults(data))
    .catch((err)=>alert("You are requesting data from too far back please change your date input"))
});

function searchResults(data){
    document.getElementById('searchCardContainer').innerHTML = '<div id="cardsButton"></div>';

    let maxArticles = data.articles.length <=15 ? data.articles.length : 15;
    let searchData = data.articles.slice(0,maxArticles);
    html_text = "";
    let index = 0;
    if(maxArticles == 0){
        document.getElementById('cardsButton').insertAdjacentHTML('beforebegin',"<p>No Results</p>");
        return
    }
    for(article of searchData){
        let date = article.publishedAt.trim();
        if(index <5){
            html_text += '<div class="row">'
            html_text += '<div class="searchCard" onclick="expandCard(this)">'
            html_text += "<img src='" + article.urlToImage.trim() +"' alt='Avatar'>"
            html_text += '<div class="cardData">'
            html_text += '<p><b>' + article.title.trim() +'</b></p>'
            html_text += '<p class="cardAuthor hidden"><b>Author: </b>' + article.author.trim() + '</p>'
            html_text += '<p class="cardSource hidden"><b>Source: </b>' + article.source.name.trim() + '</p>'
            html_text += '<p class="cardDate hidden" ><b>Date: </b>' +  date.slice(5,7) + "/" + date.slice(8,10) + "/" + date.slice(0,4) + '</p>'
            html_text += '<p class="cardDesc descriptionToggle">' + article.description.trim() + '</p>'
            html_text += '<a class="cardLink hidden" href="' + article.url.trim() + '" target="_blank">See Original Post</a>'
            html_text += '</div><button type="button" class="close hidden" onclick="collapseCard(event)"></button></div></div>'
            index +=1;
        }
        else{
            html_text += '<div class="row">'
            html_text += '<div class="searchCard hidden" onclick="expandCard(this)">'
            html_text += "<img src='" + article.urlToImage.trim() +"' alt='Avatar'>"
            html_text += '<div class="cardData">'
            html_text += '<p><b>' + article.title.trim() +'</b></p>'
            html_text += '<p class="cardAuthor hidden"><b>Author: </b>' + article.author.trim() + '</p>'
            html_text += '<p class="cardSource hidden"><b>Source: </b>' + article.source.name.trim() + '</p>'
            html_text += '<p class="cardDate hidden" ><b>Date: </b>' + article.publishedAt.trim() + '</p>'
            html_text += '<p class="cardDesc descriptionToggle">' + article.description.trim() + '</p>'
            html_text += '<a class="cardLink hidden" href="' + article.url.trim() + '" target="_blank">See Original Post</a>'
            html_text += '</div><button type="button" class="close hidden" onclick="collapseCard(event)"></button></div></div>'
            index +=1;
        }

    }
    html_text += '<button id="cardsButton" class="formButton" value="more" onclick="cardManager()" style="width: 100px;" >Show More</button>';
    document.getElementById('cardsButton').insertAdjacentHTML('beforebegin',html_text);
}

// <div class="row">
// <div class="searchCard expanded" onclick="expandCard(this)">
//   <img src="https://i.insider.com/5c750e0f70a61e68c66eba85?width=1200&format=jpeg" alt="">
//   <div class="cardData" style="display: inline-block;">
//     <p><b>10 things in tech you need to know today</b></p>
//     <p class="cardAuthor"><b>Author: </b> author</p>
//     <p class="cardSource"><b>Source: </b>source</p>
//     <p class="cardDate"><b>Date: </b>date</p>
//     <p class='cardDesc descriptionToggle'>Good morning! This is the tech news you need to know this Tuesday. Sources say Amazon has refused to close 2 Spanish warehouses despite 3 confirmed cases of COVID-19. The decision to keep the warehouses open incensed local workers' union the CCOO, which said</p>
//     <a class="cardLink" href="#" target="_blank">See Original Post</a>
//   </div>
//   <button type="button" class="close" onclick="collapseCard(event)"></button>
// </div>
// </div>  

function cardManager(){
    let cards = document.getElementsByClassName("searchCard");
    let button = document.getElementById('cardsButton');
    if(button.value == "more"){
        for(card of cards){
            card.classList.remove("hidden");
        }
        button.value = "less";
        button.innerText = "Show Less";
    } else{
        document.documentElement.scrollTop = 0;
        let index = 0;
        for(card of cards){
            if(index > 5){
                card.classList.add("hidden");
            }
            index++;
        }
        button.value = "more";
        button.innerText = "Show More";
    }

}

function expandCard(element) {

    let cards = element.childNodes[1].childNodes;
    element.classList.add("expanded")
    for(card of cards){
        if(card.nodeType == Node.ELEMENT_NODE){
            card.classList.remove("hidden");
            element.classList.add("expanded")
        }
        if(card.classList.contains("cardDesc")){
            card.classList.add("cardDescExpanded");
            card.classList.remove("cardDesc");
        }
    }
    element.childNodes[2].classList.remove("hidden");
}

function collapseCard(e){
    e.stopPropagation();
    let authors = document.querySelectorAll(".cardAuthor");
    let sources = document.querySelectorAll(".cardSource");
    let dates = document.querySelectorAll(".cardDate");
    let links = document.querySelectorAll(".cardLink");
    let closes = document.querySelectorAll(".close");
    let cards = document.querySelectorAll(".searchCard");
    let descr = document.querySelectorAll(".descriptionToggle");

    for(author of authors){
        author.classList.add("hidden");
    }
    for(source of sources){
        source.classList.add("hidden");
    }
    for(date of dates){
        date.classList.add("hidden");
    }
    for(link of links){
        link.classList.add("hidden");
    }
    for(close of closes){
        close.classList.add("hidden");
    }
    for(card of cards){
        card.classList.remove("expanded");
    }
    for(ds of descr){
        ds.classList.remove("cardDescExpanded");
        ds.classList.add("cardDesc");
    }

}
