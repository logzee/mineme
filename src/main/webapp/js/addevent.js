valueCounter = 1;
function check(elem) {
    var newType = elem.options.length-1;
    var opt = elem.options[newType];

    if(opt.selected) {
        addInput();
    } else {
        removeInput();
    }
}
function addInput() {
    var newDiv = document.createElement('div');
    newDiv.setAttribute("id", "new_type_input");
    newDiv.innerHTML =
        "<input name='newtype' type='text' placeholder='Название нового типа'>";
    document.getElementById('form_wrapper').appendChild(newDiv);
}

function removeInput() {
    var input = document.getElementById('new_type_input');
    var wrapper = document.getElementById('form_wrapper');
    wrapper.removeChild(input)
}

function addValueInput() {
    if (valueCounter<5) {
        var newDiv = document.createElement('div');
        newDiv.setAttribute("id", "new_value_input");
        newDiv.innerHTML =
            "<input name='val" + valueCounter + "' type='text' placeholder='Значение'>";
        document.getElementById('values_wrapper').appendChild(newDiv);
        valueCounter++;
    }
}

function removeValueInput() {
    if(valueCounter>0) valueCounter--;
    var input = document.getElementById('new_value_input');
    var wrapper = document.getElementById('values_wrapper');
    wrapper.removeChild(input)
}