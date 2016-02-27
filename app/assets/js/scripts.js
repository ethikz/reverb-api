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
    '<div class="reverb">' +
      '<div class="image">' +
        '<img src="{{ article.photos[0]._links.thumbnail.href }}">' +
      '</div>' +
      '<div class="title">' +
        '<a href="#" data-id="{{ article.id }}">{{ article.title }}</a>' +
      '</div>' +
    '</div>'
  ),
  reverbDetailTemplate = _.template(
    '<div class="reverb-modal" id="{{ article.id }}">' +
      '<div class="reverb-content">' +
        '<div class="reverb-content__header">' +
          '<a href="#" class="pull-right close">Close</a>' +
          '{{ article.make }} {{ article.model }}' +
          '<br>' +
          '{{ article.condition }}' +
          '<br>' +
          '{{ article.price.symbol }}{{ article.price.amount }}' +
        '</div>' +
        '<div class="reverb-content__description">{{ article.description }}</div>' +
      '</div>' +
    '</div>'
  );

// Get's Article Extract on button press and load images
// 'url': 'https://reverb.com/api/listings/all?query=' + param + '&per_page=200',
function getReverbListing( ) {
  $.ajax({
    'url': 'https://reverb.com/api/my/wishlist',
    'method': 'GET',
    'dataType': 'json',
    'contentType': "application/json",
    'headers': {
      'accept': 'application/json',
      'content-type': 'application/json'
    },
    beforeSend: function( xhr ) {
      xhr.setRequestHeader("X-Auth-Token", atob('MDc0OWVlZTE1MzAyOWViMzFjOTI0NjIzZDEwOTEzNzU3ZmMzYjVmNTIwZDJiMjliZjIwNWE0MmZiNjk0ZjhhZQ=='))
    }
  }).done(function( response ) {
    appendListing(_.values(response.listings));
  });
}

function reverbList( ) {
  $('.reverb-wrapper').empty();
  $('.article-content-wrapper').empty();
  getReverbListing();
}

function appendListing( listing ) {
  $.each(listing, function(i, item) {
    $('body').append(reverbDetailTemplate({article: item}));
    $('.reverb-wrapper').append(reverbListingTemplate({article: item}));
  });
}

// Click events
$('.btn').on('click', function() {
  var param = $('input').val();
  reverbList();
});

$('input').on('focusout', function() {
  $('.btn').text('Find ' + $(this).val() + ' Listings');
});

$(document).on('click', '.title a', function( e ) {
  e.preventDefault();
  $('#' + $(this).data('id')).addClass('reverb-modal--visible')
});

$(document).on('click', '.close', function( e ) {
  e.preventDefault();
  $(this).parent().parent().parent().removeClass('reverb-modal--visible')
});
