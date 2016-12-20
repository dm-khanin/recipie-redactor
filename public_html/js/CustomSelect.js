function CustomSelect(selector, options) {

    options = options || {};

    options.data = options.data || {};
    options.placehold = options.placehold || 'Без категории';

    if (!(selector instanceof jQuery)) selector = $(selector);

    var select = [];

    createSelect();

    this.val = function () { //Object returns select's val
        if (select[select.length - 2] === undefined) return "0";
        return +select[select.length - 1].val() || select[select.length - 2].val(); //If last select is uncategorized
    };

    function createSelect(){

        var length = select.length || 0; //Select key array of element

        var category = length ? select[select.length - 1].val() : null; //Chosen parent category

        var categories = getCategories(category);

        if ( !(categories.length > 0) ) return; //If no data we won't add select to dom and array

        select[length] = $("<select/>");
        select[length].addClass('form-control');

        select[length].append($("<option/>", { //Uncategorized option added
            text: options.placehold,
            value: 0,
            selected: true
        }));

        $.each(categories, function(i, item){
            select[length].append($("<option/>",{text: item.title, value: item.id}));
        });

        if (selector) { //Substitute the selector with new select
            selector.parent().append(select[length]);
            selector.remove();
            selector = undefined;
        } else { //Append select if selector doesn't exist already
            select[0].parent().append(select[length]);
        }

        select[length].change(function () {
            while (select[length + 1]) { //Remove all selects after previous selector from DOM and array
                select[select.length - 1].remove();
                select.pop();
            }
            createSelect();
        });
    }

    function getCategories(parent) {
        var result = [];

        $.each(options.data, function (i, item) {
            if (parent === null) {
                if (item.parent_id === parent) result[result.length] = item;
            }
            else {
                if (item.parent_id === +parent) result[result.length] = item;
            }
        });

        return result;
    }
}
