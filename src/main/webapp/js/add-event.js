valueCounter = 1;

addedInputId = null;

// инициализация структуры событий
var structData = JSON.parse(document.getElementById('struct-data').innerHTML);
struct = structData.struct;

/**
 * Возвращает тип события по его имени из struct
 **/
function getEventType(eventName) {
    return getEventStruct(eventName).dataType;
}

/**
 * Вызывается при смене значения в форме
 **/
function updateForm(select) {
    var newTypeOption = select.options.length-1;
    newTypeOption = select.options[newTypeOption];

    eventName = select.value;

    if (eventName == "none") {
        removeInput();
        return;
    }

    try {
        dataType = getEventType(eventName);
    } catch (e) {
        dataType = "new";
    }

    removeInput();

    switch (dataType) {
        case "enum":
            addEnumInput(eventName);
            break;
        case "subtypes":
            addSubtypesInput(eventName);
            break;
        case "new":
            addNewTypeInput();
            break;
    }

    if (eventName == newTypeOption) {
        alert(true);
    }
}

function addSubtypesInput(eventName) {
    var wrapper = document.createElement('div');
    wrapper.setAttribute("id", "enum-input");
    result = "<label>Выбери</label><select id='enum'>";
    enumStruct = getEventStruct(eventName);

    for (var i = 0; i < enumStruct.value.length; i++) {
        result += "<option value='" + i + "'>" + enumStruct.value[i].title + "</option>";
    }
    result += "<option value='new-subtype'>Новый подтип</option>";
    result += "</select><p></p>";
    wrapper.innerHTML = result;
    document.getElementById('form-wrapper').appendChild(wrapper);
    addedInputId = "enum-input";
}

/**
 * Возвращает событие из struct по его имени
 **/
function getEventStruct(eventName) {
    for (var i = 0; i < struct.length; i++) {
        if (struct[i].title == eventName) {
            return struct[i];
        }
    }
}

/**
 * Убирает инпут, если он есть
 **/
function removeInput() {
    if (addedInputId != null) {
        addedInput = document.getElementById(addedInputId);
        addedInput.remove();
        addedInputId = null;
    }
}

function addEnumInput(eventName) {
    var wrapper = document.createElement('div');
    wrapper.setAttribute("id", "enum-input");
    result = "<label>Выбери</label><select id='enum'>";
    enumStruct = getEventStruct(eventName);

    for (var i = 0; i < enumStruct.value.length; i++) {
        result += "<option value='" + i + "'>" + enumStruct.value[i] + "</option>";
    }

    result += "</select><p></p>";
    wrapper.innerHTML = result;
    document.getElementById('form-wrapper').appendChild(wrapper);
    addedInputId = "enum-input";
}

function addNewTypeInput() {
    var newDiv = document.createElement('div');
    newDiv.setAttribute("id", "new-type-input");
    newDiv.innerHTML =
        "<input name='new-type' type='text' placeholder='Название нового типа'>";
    document.getElementById('form-wrapper').appendChild(newDiv);
    addedInputId = "new-type-input";
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
var eventDropdown = document.getElementById('event-dropdown');

var option = document.createElement('option');
option.setAttribute("value", "none");
option.innerHTML = 'Выбери тип события';
eventDropdown.appendChild(option);

for (var i = 0; i < struct.length; i++) {
    if (struct[i].hidden != true) {
        option = document.createElement('option');
        option.innerHTML = struct[i].title;
        eventDropdown.appendChild(option);
    }
}

option = document.createElement('option');
option.setAttribute("value", "new");
option.innerHTML = 'Новый тип';
eventDropdown.appendChild(option);

