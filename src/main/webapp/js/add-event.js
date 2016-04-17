// some data initialization
var xhr = new XMLHttpRequest();
xhr.open('GET', 'data?method=getEventTypesStruct', false);
xhr.send();
var structRoot = JSON.parse(xhr.responseText).struct;

var formWrapper = document.getElementById('form-wrapper');
var structChain = [];
var currentNode = structRoot;

document.addEventListener("DOMContentLoaded", dropDownInit);

/**
 * Call when input value changed
 *
 * @param form html element that has called the function
 */
function updateForm(form) {
    var eventNumber = form.value;

    clearBelow(form);

    var targetStruct = getEventStruct(eventNumber);

    var dataType;
    try {
        dataType = targetStruct.dataType;
    } catch (ignored) { }
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
 * Add a new text input
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
 * Add multiple text fields for the list structRoot
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
 * Add new dropdown input
 *
 * @param itemStruct structure of item to add dropdown input for
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
 * Return structure of the event type from structRoot by its number and nesting level
 *
 * @param eventNumber code number of the event type
 * @return currentNode structure of requested event type
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
 * Remove all inputs under the element
 *
 * @param input element
 */
function clearBelow(input) {
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
 * Set currentNode according to event chain
 */
function resetStructChain() {
    var result = structRoot;
    for (var i = 0; i < structChain.length; i++) {
        result = result.value[structChain[i]];
    }
    currentNode = result;
}

/**
 * Call when the page loaded
 */
function dropDownInit() {
    var eventDropdown = document.getElementById('event-dropdown');

    var option = document.createElement('option');
    option.setAttribute("value", "none");
    option.setAttribute("disabled", "true");
    option.setAttribute("selected", "true");
    option.innerHTML = 'Тип события';
    eventDropdown.appendChild(option);

    for (var i = 0; i < structRoot.value.length; i++) {
        if (structRoot.value[i].hidden != true) {
            option = document.createElement('option');
            option.innerHTML = structRoot.value[i].title;
            option.setAttribute('value', i);
            eventDropdown.appendChild(option);
        }
    }

    // setting default date and time
    var currentTimestamp = parseInt(document.getElementById('server-timestamp').innerHTML);
    var datePicker = document.getElementById('date-picker');
    datePicker.value = formatDateStd(currentTimestamp);

    var timePicker = document.getElementById('time-picker');
    timePicker.value = formatTime(currentTimestamp);
}
/**
 * Format date in dd.MM.yyyy
 *
 * @param timestamp
 * @returns {string}
 */
function formatDateStd(timestamp) {
    var date = new Date(timestamp);

    return ("00" + date.getDate()).slice(-2) + "." +
        ("00" + (date.getMonth() + 1)).slice(-2) + "." +
        date.getFullYear();
}

/**
 * Format time in HH:mm
 * 
 * @param timestamp
 * @returns {string}
 */
function formatTime(timestamp) {
    var date = new Date(timestamp);

    return ("00" + date.getHours()).slice(-2) + ":" +
        ("00" + date.getMinutes()).slice(-2);
}

/**
 * Send data to the server
 */
function sendData() {
    // getting data from the forms
    var values = document.getElementsByClassName('input-value');
    var resultData = structChain;

    var tags = document.getElementById('tags');
    tags = tags.value.split(/, */);

    // validating data
    var inputsData = [];
    for (var i = 0; i < values.length; i++) {
        if (!isBlank(values[i].value)) {
            inputsData.push(values[i].value);
        }
    }

    var validTags = [];
    for (var i = 0; i < tags.length; i++) {
        if (!isBlank(tags[i])) {
            validTags.push(tags[i].toLowerCase());
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
        tags: validTags
    };

    // getting date & time from inputs
    var timePicker = document.getElementById('time-picker');
    var datePicker = document.getElementById('date-picker');

    var hour = timePicker.value.split(":")[0];
    var minute = timePicker.value.split(":")[1];

    var day = datePicker.value.split(".")[0];
    var month = datePicker.value.split(".")[1];
    var year = datePicker.value.split(".")[2];

    if (isBlank(hour) || isBlank(minute) || isBlank(day) || isBlank(month) || isBlank(year)) {
        ukAlert('Ошибка при вводе времени или даты', 'uk-alert-warning');
        return;
    }

    // var currentDate = new Date();
    // var currentYear = currentDate.getFullYear();
    // var currentMonth = currentDate.getMonth();
    // var currentDay = currentDate.getDate();

    result.date = new Date(parseInt(year), 
                            parseInt(month-1), 
                            parseInt(day), 
                            parseInt(hour), 
                            parseInt(minute)).getTime().toString();

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'data?method=addEvent', true);
    xhr.send(JSON.stringify(result));

    ukAlert("Загрузка...");
    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return;
        
        if (xhr.status == 200) {
            ukAlert("Запись добавлена успешно");
            clearTagsAndTime();
        } else {
            ukAlert("Ошибка при добавлении. Код " + xhr.status + ": " + xhr.statusText, 'uk-alert-danger');
        }
    };
}

/**
 * Check if string is blank, null, undefined or has no characters but spaces
 *
 * @return boolean
 */
function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

/**
 *  Display a uikit alert message
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
    alertWrapper.innerHTML = '';
    alertWrapper.appendChild(ukAlert);
}

/**
 * Clear forms
 */
function clearTagsAndTime() {
    updateForm(document.getElementById('event-dropdown'));
    document.getElementById('tags').value = '';
}