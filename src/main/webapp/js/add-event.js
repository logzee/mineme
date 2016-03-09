// инициализация структуры событий
var structData = JSON.parse(document.getElementById('struct-data').innerHTML);
var struct = structData.struct;

var formWrapper = document.getElementById('form-wrapper');

var structChain = [];

var currentNode = struct;



/**
 * Вызывается при смене значения в форме
**/
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

/*
    Добавляет новый текстовой input, принимает структуру как аргумент
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

/*
    Добавляет несколько текстовых полей для структуры list
*/
function addListInput(listStruct) {
    var wrapper = document.createElement('div');
    wrapper.setAttribute("class", "uk-form-row list-wrapper");
    for (var i = 0; i < listStruct.value.length; i++) {
        var itemStruct = listStruct.value[i];
        var field;
        if (itemStruct.dataType=="input") { // если input, то остальные типы исключаются (вроде subtypes)
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

/*
    Добавляет новый dropdown input, принимает структуру как аргумент
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
 * Возвращает структуру события из struct по его номеру, учитывается уровень (вложенности) события
**/
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
 * Убирает все инпуты, что есть под переданной формой
**/
function clearBelow(input) {
    // определяем индекс input'a
    var targetIndex = 0;

    while( (input = input.previousElementSibling) != null ) {
        targetIndex++;
    }

    var allChildren = formWrapper.childNodes; // массив со всеми childnod'ами form-wrapper'a (включая текстовые)

    var elementChildren = []; // массив со всеми childnod'ами form-wrapper'a исключая текстовые

    for (var i = 0; i < allChildren.length; i++) {
        if(allChildren[i].nodeType == Node.ELEMENT_NODE) {
            elementChildren.push(allChildren[i]);
        }
    }

    for (var i = targetIndex+1; i < elementChildren.length; i++) {
        elementChildren[i].remove();
    }

    // обрезаем цепочку значений
    structChain = structChain.slice(0, targetIndex);
    resetStructChain();
}

/*
    Устанавливает currentNode в соответствии с цепочкой событий
*/
function resetStructChain() {
    var result = struct;
    for (var i = 0; i < structChain.length; i++) {
        result = result.value[structChain[i]];
    }
    currentNode = result;
}

// вызвается при загрузке страницы
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

function sendData() {
    var values = document.getElementsByClassName('input-value');
    var xhr = new XMLHttpRequest();
    var resultData = structChain;

    // проверка данных на корректность
    var inputsData = [];

    // добавляем в inputsData непустые строки из текстовых полей
    for (var i = 0; i < values.length; i++) {
        if (!isBlank(values[i].value)) {
            inputsData.push(values[i].value);
        }
    }

    if (formWrapper.children.length > structChain.length + inputsData.length) {
        alert('Ошибка ввода. Всё вводи');
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
    xhr.open('POST', 'ins-handle.jsp', false);
    xhr.send(JSON.stringify(result));
    if (xhr.status == 200) {
        alert("Запись добавлена успешно");
    } else {
        var debug = document.getElementById('response-debug');
        debug.innerHTML = xhr.responseText;
        alert("Ошибка при добавлении. Код " + xhr.status);
    }
}

/*
    Функция для проверки строки на пустоту, пробелы, null, undefined
*/
function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}
document.addEventListener("DOMContentLoaded", dropDownInit);