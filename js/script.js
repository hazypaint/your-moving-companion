
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    var streetValue = $('#street').val();
    var cityValue = $('#city').val();
    var address = streetValue + ', ' + cityValue;

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    //Greeting text includes location
    $greeting.text('So, you want to live at ' + address + '?');

    //Generates Google Streetview image
    var streetviewUrl = "http://maps.googleapis.com/maps/api/streetview?size=600x400&location=" + address + "";
    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');

    // creates link for AJAX request
    var requestNYT = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + cityValue + "&api-key=bec2df7e772a904f941747a02d2bc3e7:4:72782796";
    // console.log(requestNYT);

    // NYTimes AJAX request
    $.getJSON(requestNYT)
        .done ( function (data) {
            $nytHeaderElem.text("New York Times articles about: " + cityValue);
            articles = data.response.docs;

            //runs through each article and provides the requested data from each
            for (var i = 0 ; i < articles.length ; i++ ) {
                var headlineAndLink = "<a href='" + articles[i].web_url + "'target='_blank''>" + articles[i].headline.main;
                var snippet = "<p>" + articles[i].snippet + "</p>" ;
                $nytElem.append("<li class='article'>" + headlineAndLink  + "</a>" + snippet + "</li>" );
                };
        })

        .fail ( function (e) {
            $nytHeaderElem.text("New York Times article could not be loaded.");
        });

    // wiki link created with Wikipedia API sandbox
    var requestWiki = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='+ cityValue + '&format=json&callback=wikiCallback'
    // console.log("wikilink: " + requestWiki);

    // Wikipedia AJAX request
    $.ajax({
        type: "GET",
        url: requestWiki,
        dataType: "jsonp",
        success: function (response) {
            var wikiArticles = response[1];

            for (var i = 0 ; i < wikiArticles.length ; i++ ) {
                var articleStr = wikiArticles[i];
                console.log(articleStr);
                var url = "http://en.wikipedia.org/wiki/" + wikiArticles[i];
                $wikiElem.append("<li><a href='" + url + "'target='_blank'>" + articleStr + "</a></li>" );
                };
        },
        error: function (errorMessage) {
            $wikiElem.text("Wikipedia articles could not be loaded.");
        }

    });

    return false;
};

$('#form-container').submit(loadData);

loadData();



