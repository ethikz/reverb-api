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
      '<div class="wiki-content">' +
        '<div class="make">{{ article.make }} {{ article.model }}</div>' +
        '<div class="condition">{{ article.condition }}</div>' +
        '<div class="price">{{ article.price.symbol }}{{ article.price.amount }}</div>' +
        '<div class="article">{{ article.description }}</div>' +
      '</div>' +
    '</div>'
  );

// Get's Article Extract on button press and load images
function getReverbListing( param ) {
  $.ajax({
    'url': 'https://reverb.com/api/listings/all?query=' + param,
    'method': 'GET',
    'headers': {
      'accept': 'application/json',
      'content-type': 'application/json'
    }
  }).done(function( response ) {
    appendListing(_.values(response.listings));
  });
}

function reverbList( param ) {
  $('.wiki-wrapper').empty();
  $('.article-content-wrapper').empty();
  getReverbListing(param);
}

function appendListing( listing ) {
  $.each(listing, function(i, item) {
    $('.wiki-wrapper').append(reverbListingTemplate({article: item}));
  });
}

// Click events
$('.btn').on('click', function() {
  var param = $('input').val();
  reverbList(param);
});

$('input').on('focusout', function() {
  $('.btn').text('Find ' + $(this).val() + ' Listings');
});

$(document).on('click', '.title a', function( e ) {
  e.preventDefault();
  if ( !$(this).parent().siblings('.wiki-content').hasClass('wiki-content--visible') ) {
    $(this).parent().siblings('.wiki-content').addClass('wiki-content--visible');
  } else {
    $(this).parent().siblings('.wiki-content').removeClass('wiki-content--visible');
  }
});
