$(document).ready(function() {

    $("#photo-url").change(function(event) {
        $(".food-photo").prop("src", $(this).val());
    });

    $('#complexity').barrating({
        theme: 'fontawesome-stars'
    });

    var select;

    $.ajax({
        url: 'server-data/categories.json',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            select = new CustomSelect($('#category'), {
                data: data,
                placehold: "Без категории"
            });
        }
    });

    $.ajax({
        url: 'server-data/tags.json',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            $.each(data, function (i, item) {
                $('#tags').append(
                    $('<option/>', {value: item.id, text: item.title})
                );
            });

            $('#tags').select2({
                tags: true,
                theme: 'bootstrap',
                placeholder: 'Выберите теги'
            });
        }
    });

    var descriptionValue = '';
    $("#steps textarea").keyup(function() {
        descriptionValue = $(this).val().replace(/\n/g, '<br/>')
    });

    var ingridients = [];
    getIngridients(1);

    function getIngridients(numOfFile) {
        $.ajax({
            url: "server-data/ingridients/" + numOfFile + ".txt",
            type: "GET",
            dataType: "text",
            success: function(data) {
                ingridients.push({
                    title: data,
                    src: 'server-data/ingridients/' + numOfFile + '.jpg'
                });
                getIngridients(++numOfFile); //вызываем опять себя
            },
            error: function(data) { //выполнится, когда файлы ингридиентов закончатся
                for (var i = 0, len = ingridients.length; i < len; i++) {
                    $('#ingridients-container').append(
                        $('<div/>', {class: "ingridient"}).append(
                            $('<div/>', {class: "image-cropper"}).append(
                                $('<img/>', {src: ingridients[i].src, 'data-tooltip': 'Добавить'})
                            )
                        ).append(
                            $('<p/>', {class: "ingridient-title", text: ingridients[i].title})
                        )
                    );
                }
                $(setTooltip);//подсказка юзеру для добавления продукта
            }
        });
    }

    $('#ingridients-container').on('click', '.ingridient', function() {
        //$(this).css({display: "none"});
        var _clone = $(this).clone();
        var self = this;
        $(this).hide(400);


        _clone.css({height: "166px", display: "block"});
        _clone.attr('data-name', _clone.find('p').text());

        $('#ingridients-selected').append(_clone);
        _clone.append(
            $('<input/>', {type: "number", min: 1, class: "form-control quantity", placeholder: "Количество"}).change(
                function() {
                    _clone.attr('data-count', $(this).val());
                }
            )
        );

        _clone.find('img').attr('data-tooltip', 'Удалить'); //подсказываем юзеру, что выбранный ингридиент можно вернуть обратно
        $(setTooltip);

        _clone.find('img').click(function() {
            //$(self).css({display: "block"});
            $(self).show(400);
            _clone.hide(400);
            _clone.remove();
            $('#tooltip').css('display', 'none');
        });
    });

    function isFieldsEmpty() {
        var res = false;
        function showError(node) {
            $(node).css({boxShadow: "0px 0px 10px red"});
            $("#save-btn").addClass('btn-danger').effect("shake", {times: 1, distance: 3}, 100);
            setTimeout(function() {
                $(node).css({boxShadow: ""});
                $("#save-btn").removeClass('btn-danger');
            }, 500);
            res = true;
        }

        $('#title, #photo-url, [type="number"]').each(function(i, item) {
            if (!$(item).val() || $(item).val() == 0) {
                showError(item);
            }
        });

        if (!$('#ingridients-selected').children().length) {
            showError();
        }

        if ($('.bfh-timepicker').val() == '00:00') {
            showError($('.bfh-timepicker'));
        }

        if (!$('#steps textarea').val()) {
            showError($('#steps textarea'));
        }

        if (res == false) { //если всё хорошо, то по кнопке произойдет вызов модального окна
            $('#save-btn').attr('data-layer-target', '#layer');
        }
        return res;
    }

    $("#save-btn").click(
        function() {
            console.log($('#steps textarea').val());
            var pushedIngredients = [];
            if (isFieldsEmpty()) return;
            $("#ingridients-selected .ingridient").each(function (i, item) {
                var ingr = {};
                ingr.name = $(item).attr('data-name');
                ingr.count = +$(item).attr('data-count');
                pushedIngredients.push(ingr);
            });

            var results = {
                "title": $("#title").val(),
                "URL": avatar,
                "visible": $("#visible").is(":checked"),
                "prepareTime": $('#prepare-time').val(),
                "complexity": $('#complexity').val(),
                "category": select.val(),
                "tags": $('#tags').val() || [],
                "ingredients": pushedIngredients,
                "steps": descriptionValue
            };
            var exportData = JSON.stringify(results, '', 4);   //упаковали результаты в JSON
            console.log(exportData);
            $(document.body).append($('<pre/>').html(exportData));
        }
    );

    var avatar = '';

    Dropzone.autoDiscover = false;

    $('#avatar').dropzone({
        url: "upload.php",
        success: function (file, response) {
            avatar = JSON.parse(response).file;
            $('#avatar').prop('src', avatar).removeClass('food-photo');
        }
    });

});