$(document).ready(function () {
  var url = 'http://157.230.17.132:3000/todos/';
  getToDo(url);
  $('#to-add-button').click(function(){
    var to_add = $('#to-add-input').val();
    if (to_add.length > 0) {
      addToDo(url,to_add);
    }
  });

  $(document).on('click','.fa-trash-alt',function () {
    var current_item = $(this).parents('li').attr('data-id');
    delToDo(url,current_item);
  });

  $(document).on('click','.fa-pen',function () {
    $(this).parents('li').find('.to-edit-input').addClass('active');
    $(document).on('keypress','.to-edit-input',function (enter) {
      var keyCode = (enter.which);
      if (keyCode == '13') {
        var edit_text = $(this).val();
        var current_item = $(this).parents('li').attr('data-id');
        $(this).removeClass('active');
        if (edit_text.length > 0) {
          editToDo(url,edit_text,current_item)
        }
      }
    })
  });
});

function getToDo(url,current_item) {
  var template = Handlebars.compile($('#template').html());
  $('.to-do').html('');
  $.ajax({
    'url': url,
    'method': 'GET',
    'success': function (data) {
      var to_do ;
      for (var i = 0; i < data.length; i++) {
        var to_do = {
          'text': data[i].text,
          'id': data[i].id
        };
        var html = template(to_do);
        $('.to-do').append(html);
      };
      //serve per l'editToDo in modo da far visualizzare il messaggio "Elemento modificato!"
      //vado a fare un controllo sull'id dell'elemento e se corrisponde a quello modificato
      //attivo lo span che contiene il messaggio e lo disattivo dopo 1 secondo
      $('.to-do-list').each(function() {
        var item_id = $(this).find('li').attr('data-id');
        if (item_id == current_item) {
        $(this).find('li').children('.element-list-state').fadeIn();
        var state_text = currentState($(this).find('li').children('.element-list-state'));
        setTimeout(function () {
          state_text.fadeOut();
        }, 1000);
        }
      })
    },
    'error': function () {
      alert('errore');
    }
  });
};

function currentState(state_text) {
  return state_text
}

function addToDo(url,to_add) {
  $.ajax({
    'url': url,
    'method': 'POST',
    'data':{
      'text': to_add
    },
    'success': function () {
      getToDo(url)
    },
    'error': function () {
      alert('errore');
    }
  });
};

function delToDo(url,to_del) {
  $.ajax({
    'url': url + to_del,
    'method': 'DELETE',
    'success': function () {
      getToDo(url)
    },
    'error': function () {
      alert('errore');
    }
  });
};

function editToDo(url,to_edit,id){
  $.ajax({
    'url': url + id,
    'method': 'PUT',
    'data':{
      'text': to_edit
    },
    'success': function () {
        getToDo(url,id);
    },
    'error': function () {
      alert('errore');
    }
  });
};
