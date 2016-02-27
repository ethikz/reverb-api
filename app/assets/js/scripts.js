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
    '<div class="item">' +
      '<div class="item__image">' +
        '<img src="{{ article.photos[0]._links.thumbnail.href }}">' +
      '</div>' +
      '<div class="item__title">' +
        '<a href="#" data-id="{{ article.id }}">{{ article.title }}</a>' +
      '</div>' +
    '</div>'
  ),
  reverbDetailTemplate = _.template(
    '<div class="item-modal" id="{{ article.id }}">' +
      '<div class="item-content">' +
        '<div class="item-content__header">' +
          '<a href="#" class="pull-right close">Close</a>' +
          '{{ article.make }} {{ article.model }}' +
          '<br>' +
          '{{ article.condition }}' +
          '<br>' +
          '{{ article.price.symbol }}{{ article.price.amount }}' +
        '</div>' +
        '<div class="item-content__description">{{ article.description }}</div>' +
      '</div>' +
    '</div>'
  );

// Get's Article Extract on button press and load images
function getReverbListing( param ) {
  $.ajax({
    'url': 'https://reverb.com/api/listings/all?query=' + param + '&per_page=200',
    'method': 'GET',
    'headers': {
      'accept': 'application/json',
      'content-type': 'application/json'
    },
    beforeSend: function() {
      $('body').append('<div id="loader"></div>');
    }
  }).done(function( response ) {
    $('#loader').remove();
    appendListing(_.values(response.listings));
  });
}

function reverbList( param ) {
  $('.item-wrapper').empty();
  $('.article-content-wrapper').empty();
  getReverbListing( param );
}

function appendListing( listing ) {
  $.each(listing, function(i, item) {
    $('body').append(reverbDetailTemplate({article: item}));
    $('.item-wrapper').append(reverbListingTemplate({article: item}));
  });
}

// Click events
$('.btn').on('click', function() {
  var param = $('input').val();
  reverbList( param );
});

$('input').on('focusout', function() {
  $('.btn').text('Find ' + $(this).val() + ' Listings');
});

$(document).on('click', '.item__title a', function( e ) {
  e.preventDefault();
  $('#' + $(this).data('id')).addClass('item-modal--visible');
  $('body').addClass('modal-open');
});

$(document).on('click', '.close', function( e ) {
  e.preventDefault();
  $(this).parent().parent().parent().removeClass('item-modal--visible');
  $('body').removeClass('modal-open');
});
