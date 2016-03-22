
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var street = $('#street').val();
    var city = $('#city').val();
    var address = street+','+city;
    var url = 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location='+address;
    $body.append('<img class="bgimg" src="'+url+'"">');

    // load NYT
    var NYTurl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q='+address+'&api-key=ebdc02200ddb427597ec356f20dcc8c1:3:74389669';
    $.getJSON(NYTurl, function (data){
        $nytHeaderElem.text("Listing articles for " + city);
        articles = data.response.docs;
        for(var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">' + '<a href="' + article.web_url+'">'+article.headline.main + '</a>'
                +'<p>' + article.snippet +'</p>'
                +'</li>');
        }
    }).error(function(){
                    $nytHeaderElem.text("An error occurred. Articles from New York Times could not be displayed.");
                });
    var reqTimeout = setTimeout(function(){
        $wikiElem.text("Oops, no wikipedia resources could be loaded");
    }, 8000);
    var Wikiurl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+city+'&format=json&callback=wikiCallback';
    $.ajax({url:Wikiurl, 
            dataType: "jsonp",
            success: function( response ) {
                var articleList = response[1];

                for(var i = 0; i < articleList.length; i++){
                    var url = 'https://en.wikipedia.org/wiki/'+articleList[i];
                    $wikiElem.append('<li><a href="'+url+'">'+articleList[i]+'</a></li>');
                }
                clearTimeout(reqTimeout);
            }
    });
    return false;
};

$('#form-container').submit(loadData);

// loadData();
