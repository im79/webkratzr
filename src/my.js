$(document).ready(function() {
    MyApp = {
        appinit: function() {
          if($("#form-signin").length){ MyApp.LoadLogin(); }
          MyApp.DocSidebarToggle();
            //more
        },

        LoadLogin: function() {
          jQuery('#form-signin').live('submit',function(e) {
            e.preventDefault();
            $.ajax({
                url: '/',
                type: 'POST',
                dataType: 'json',
                data: $('#form-signin').serialize(),
                success: function( data ) {
                    for(var id in data) {
                        jQuery('#' + id).html(data[id]);
                    }
                }
            });
            return false;
        });


        },
        DocSidebarToggle: function() {
            console.log('Messagte: clean run');
        }
    };

    MyApp.appinit();
});
