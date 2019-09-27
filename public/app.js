'use strict';

$('.toggleForm').on('click', e => {
  $('form').toggleClass('hidden')
  console.log('Im being clicked');
})
