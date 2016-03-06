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
    newDiv.setAttribute("id", "new-type-input");
    newDiv.innerHTML =
        "<input name='new-type' type='text' placeholder='Название нового типа'>";
    document.getElementById('form-wrapper').appendChild(newDiv);
}

function removeInput() {
    var input = document.getElementById('new-type-input');
    var wrapper = document.getElementById('form-wrapper');
    wrapper.removeChild(input)
}

function addValueInput() {
    if (valueCounter<5) {
        var newDiv = document.createElement('div');
        newDiv.setAttribute("id", "new-value-input");
        newDiv.innerHTML =
            "<input name='val" + valueCounter + "' type='text' placeholder='Значение'>";
        document.getElementById('values-wrapper').appendChild(newDiv);
        valueCounter++;
    }
}

function removeValueInput() {
    if(valueCounter>0) valueCounter--;
    var input = document.getElementById('new-value-input');
    var wrapper = document.getElementById('values-wrapper');
    wrapper.removeChild(input)
}

// Dropdown init
var structData = JSON.parse(document.getElementById('struct-data').innerHTML);
var eventDropdown = document.getElementById('event-dropdown');

var option = document.createElement('option');
option.setAttribute("value", "none");
option.innerHTML = 'Выбери тип события';
eventDropdown.appendChild(option);

for (var i in structData) {
    alert(structData[i].title);
}
structData.forEach(function (item, i, structData) {
    var title = item.title;
    option = document.createElement('option');
    option.innerHTML = title;
    eventDropdown.appendChild(option);
});

option = document.createElement('option');
option.setAttribute("value", "new");
option.innerHTML = 'Новый тип';
eventDropdown.appendChild(option);