// some data initialization
var struct = JSON.parse(document.getElementById('struct-data').innerHTML).struct;
var formWrapper = document.getElementById('form-wrapper');
var structChain = [];
var currentNode = struct;

/**
 * Called when input value changes
 *
 * @param form      html element which has called the function
 */
function updateForm(form) {
    var eventNumber = form.value;

    clearBelow(form);

    var targetStruct = getEventStruct(eventNumber);

    var dataType;
    try {
        dataType = targetStruct.dataType;
    } catch (ignored) {
    }
    switch (dataType) {
        case "enum":
            addDropdownInput(targetStruct);
            break;
        case "subtypes":
            addDropdownInput(targetStruct);
            break;
        case "input":
            addTextInput(targetStruct);
            break;
        case "list":
            addListInput(targetStruct);
            break;
    }
}

/**
 * Adds a new text input
 *
 * @param itemStruct    event structure of selected event
 */
function addTextInput(itemStruct) {
    var input = document.createElement('input');
    input.setAttribute('class', 'input-value');
    input.setAttribute('type', 'text');

    var placeholder;
    try {
        placeholder = itemStruct.value.title;
    } catch (uncaughtTypeError) {
        try {
            placeholder = itemStruct.title;
        } catch (e) {
            placeholder = 'Введи название';
        }
    }

    input.setAttribute('placeholder', placeholder);

    formWrapper.appendChild(input);
}

/**
 * Adds multiple text fields for the list struct
 *
 * @param listStruct
 */
function addListInput(listStruct) {
    var wrapper = document.createElement('div');
    wrapper.setAttribute("class", "uk-form-row list-wrapper");
    for (var i = 0; i < listStruct.value.length; i++) {
        var itemStruct = listStruct.value[i];
        var field;
        if (itemStruct.dataType=="input") {
            field = document.createElement('input');
            field.setAttribute('class', 'input-value');
            field.setAttribute('type', 'text');

            var placeholder;
            try {
                placeholder = itemStruct.value.title;
            } catch (uncaughtTypeError) {
                try {
                    placeholder = itemStruct.title;
                } catch (e) {
                    placeholder = 'Введи название';
                }
            }

            field.setAttribute('placeholder', placeholder);
            wrapper.appendChild(field);

        } else if (itemStruct.dataType == "enum") {
            field = document.createElement('select');
            try {
                if (itemStruct.dataType == 'end') {
                    field.setAttribute('class', 'input-value');
                }
            } catch (ignored) {}
            field.setAttribute('type', 'text');
            field.setAttribute('onchange', 'updateForm(this)');
            field.setAttribute('placeholder', 'Выбери');

            var result = "<option value='none' selected disabled>Выбери значение</option>";
            for (var i = 0; i < itemStruct.value.length; i++) {
                result += "<option value='" + i + "'>" + itemStruct.value[i].title + "</option>";
            }

            field.innerHTML = result;
            wrapper.appendChild(field);
        }
    }
    formWrapper.appendChild(wrapper);
}

/**
 * Adds new dropdown input, takes the item's structure as the argument
 *
 * @param itemStruct    structure of item to add dropdown input for
 */
function addDropdownInput(itemStruct) {
    var select = document.createElement('select');
    if (!itemStruct.hasOwnProperty('value')) {
        select.setAttribute('class', 'input-value');
    }
    select.setAttribute('onchange', 'updateForm(this)');
    select.setAttribute('placeholder', 'Выбери');

    var result = "<option value='none' selected disabled>Выбери значение</option>";
    for (var i = 0; i < itemStruct.value.length; i++) {
        result += "<option value='" + i + "'>" + itemStruct.value[i].title + "</option>";
    }

    select.innerHTML = result;
    formWrapper.appendChild(select);
}

/**
 * Returns structure of the event type from struct by its number and nesting level
 *
 * @param eventNumber     index number of the event type
 * @return currentNode      structure of requested event type
 */
function getEventStruct(eventNumber) {
    structChain.push(eventNumber);
    var level = structChain.length;
    var eventType = currentNode.dataType;
    switch (eventType) {
        case "subtypes":
            currentNode = currentNode.value[structChain[level-1]];
            break;
        default:
            currentNode = currentNode.value;
            break;
    }
    return currentNode;
}

/**
 * Removes all inputs under the input, which has passed as the argument
 *
 * @param input
 */
function clearBelow(input) {
    // определяем индекс input'a
    var targetIndex = 0;

    while( (input = input.previousElementSibling) != null ) {
        targetIndex++;
    }

    var allChildren = formWrapper.childNodes;

    var elementChildren = [];

    for (var i = 0; i < allChildren.length; i++) {
        if(allChildren[i].nodeType == Node.ELEMENT_NODE) {
            elementChildren.push(allChildren[i]);
        }
    }

    for (var i = targetIndex+1; i < elementChildren.length; i++) {
        elementChildren[i].remove();
    }


    structChain = structChain.slice(0, targetIndex);
    resetStructChain();
}


/**
 * Sets currentNode according to event chain
 */
function resetStructChain() {
    var result = struct;
    for (var i = 0; i < structChain.length; i++) {
        result = result.value[structChain[i]];
    }
    currentNode = result;
}

/**
 * Called when the page loads
 */
function dropDownInit() {
    var eventDropdown = document.getElementById('event-dropdown');

    var option = document.createElement('option');
    option.setAttribute("value", "none");
    option.setAttribute("disabled", "true");
    option.setAttribute("selected", "true");
    option.innerHTML = 'Тип события';
    eventDropdown.appendChild(option);

    for (var i = 0; i < struct.value.length; i++) {
        if (struct.value[i].hidden != true) {
            option = document.createElement('option');
            option.innerHTML = struct.value[i].title;
            option.setAttribute('value', i);
            eventDropdown.appendChild(option);
        }
    }
}

/**
 * Sends data to the server
 */
function sendData() {
    var values = document.getElementsByClassName('input-value');
    var xhr = new XMLHttpRequest();
    var resultData = structChain;

    // data validation
    var inputsData = [];
    for (var i = 0; i < values.length; i++) {
        if (!isBlank(values[i].value)) {
            inputsData.push(values[i].value);
        }
    }

    if (formWrapper.children.length > structChain.length + inputsData.length) {
        ukAlert('Ошибка ввода. Всё вводи', 'uk-alert-warning');
        return;
    }

    if (inputsData.length > 0) {
        if (inputsData.length > 1)
            resultData.push(inputsData);
        else
            resultData.push(inputsData[0]);
    }

    var result = {
        chain: resultData,
        tags: []
    };
    ukAlert("Запись добавлена успешно");
    xhr.open('POST', '/insert', false);
    xhr.send(JSON.stringify(result));
    xhr.onreadystatechange = function() {
        if (xhr.status == 200) {
            ukAlert("Запись добавлена успешно");
        } else {
            var debug = document.getElementById('response-debug');
            debug.innerHTML = xhr.responseText;
            ukAlert("Ошибка при добавлении. Код " + xhr.status + ": " + xhr.statusText, 'uk-alert-danger');
        }
    }
}

/**
 * Checks if string is blank, null, undefined or has no characters but spaces
 *
 * @return boolean
 */
function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}
document.addEventListener("DOMContentLoaded", dropDownInit);

/**
 *  Displays a uikit alert message
 */
function ukAlert(message, htmlClass) {
    htmlClass = htmlClass || null;
    var ukAlert = document.createElement('div');
    if (htmlClass == null) {
        ukAlert.setAttribute('class', 'uk-alert');
    } else {
        ukAlert.setAttribute('class', 'uk-alert' + ' ' + htmlClass);
    }
    ukAlert.setAttribute('data-uk-alert', 'true');

    var ukAlertClose = document.createElement('a');
    ukAlertClose.setAttribute('href', '');
    ukAlertClose.setAttribute('class', 'uk-alert-close uk-close');
    ukAlert.appendChild(ukAlertClose);

    var p = document.createElement('p');
    p.innerHTML = message;
    ukAlert.appendChild(p);

    var alertWrapper = document.getElementById('alert-wrapper');
    alertWrapper.innerHTML = "";
    alertWrapper.appendChild(ukAlert);
}