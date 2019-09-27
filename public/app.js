'use strict';

$('.toggleForm').on('click', e => {
  $('form').toggleClass('hidden')
  console.log('Im being clicked');
})

$('#newShelfButton').on('click', e => {
  // e.preventDefault();
  let newShelf = $('#shelf').val();
  console.log(newShelf)
  $('#bookshelf').append(`<option value=${newShelf}>${newShelf}</option>`)
})
