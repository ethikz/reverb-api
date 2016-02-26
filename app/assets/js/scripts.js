// Initialize underscore template variables
_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};

// Google Font Loader
(function () {
  WebFontConfig = {
    google: { families: ['Raleway:100,600', 'Ubuntu:400,700'] }
  };
  var wf = document.createElement('script');
  wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
            '://ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js';
  wf.type = 'text/javascript';
  wf.async = 'true';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(wf, s);
}());

// Define api url and templates
var reverbListingTemplate = _.template(
    '<div class="wiki">' +
      '<div class="image">' +
        '<img src="{{ article.photos[0]._links.thumbnail.href }}">' +
      '</div>' +
      '<div class="title">' +
        '<a href="#" data-id="{{ article.id }}">{{ article.title }}</a>' +
      '</div>' +
    '</div>'
  ),
  reverbDetailTemplate = _.template(
    '<div class="article-content">' +
      '<div class="image">' +
        '<img src="{{ article.photos[0]._links.small_crop.href }}">' +
      '</div>' +
      '<div class="make">{{ article.make }} {{ article.model }}</div>' +
      '<div class="condition">{{ article.condition }}</div>' +
      '<div class="price">{{ article.price.symbol }}{{ article.price.amount }}</div>' +
      '<div class="article">{{ article.description }}</div>' +
    '</div>'
  );

// Get's Article Extract on button press and load images
function getReverbListing() {
  $.ajax({
    'url': 'https://reverb.com/api/listings/all',
    'method': 'GET',
    'headers': {
      'accept': 'application/json',
      'content-type': 'application/json'
    }
  }).done(function( response ) {
    appendListing(_.values(response.listings));
  });
}

function reverbList() {
  $('.wiki-wrapper').empty();
  $('.article-content-wrapper').empty();
  getReverbListing();
}

function appendListing( listing ) {
  $.each(listing, function(i, item) {
    $('.wiki-wrapper').append(reverbListingTemplate({article: item}));
  });
}


function getReverbListingContent( id ) {
  $.ajax({
    'url': 'https://reverb.com/api/listings/' + id,
    'method': 'GET',
    'headers': {
      'accept': 'application/json',
      'content-type': 'application/json'
    }
  }).done(function( response ) {
    appendListDetail(response);
  });
}

function listDetail( id ) {
  $('.article-content-wrapper').empty();
  getReverbListingContent(id);
}

function appendListDetail( listing ) {
  $('.article-content-wrapper').append(reverbDetailTemplate({article: listing}));
}


// Click events
$('.btn').click(reverbList);

$(document).on('click', '.title a', function( e ) {
  e.preventDefault();
  listDetail($(this).data('id'));
});
