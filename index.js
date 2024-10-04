// 1. Объявление глобальных переменных для хранения данных
let formElement = document.querySelector('.form');
let submitButton = document.getElementById('submit-btn');
let passwordInput = document.getElementById('password');
let inputs = document.querySelectorAll('input, select, textarea');
let errors = [] // Создание пустого массива с ошибками

// 2. Отмена действий по умолчанию для события submit
formElement.addEventListener('submit', function (evt) {
    evt.preventDefault();
    checkAll(); 
    if (errors.length === 0) {
        // Вывод в консоль всех значений формы
        console.log("Форма отправлена! / Form submitted successfully!");
        inputs.forEach(input => console.log(`${input.name || input.id}: ${input.value}`));
        formElement.reset(); // Очистка формы
        submitButton.disabled = true;
    }
});

// 3. Функция проверки одиночного input
function checkValidity(input) {
    let validity = input.validity; // input.validity - где validity это свойство input, которое встроено в HTML5
    let errorMessage = ''; // Сообщение об ошибке для каждого поля
    // Очистка предыдущих сообщений об ошибках
    let errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.remove();
    }
    if (validity.valueMissing) {
        errorMessage = 'Поле ввода / Input: ' + input.placeholder + ' не заполнено / is not filled';
    } else if (input.id === 'name' && !isValidName(input.value)) {
        errorMessage = 'Имя и фамилия должны начинаться с заглавных букв / First and last name must start with uppercase letters';
    } else if (input.type === "email" && !isValidEmail(input.value)) {
        errorMessage = 'Неверный формат электронной почты / Invalid email format';
    } else if (validity.patternMismatch) {
        errorMessage = 'Неверный формат заполнения / Invalid format for filling';
    } else if (input.id === 'age' && (input.value < 0 || input.value > 110)) {
        errorMessage = 'Возраст должен быть в пределах от 0 до 110 лет / Age must be between 0 and 110';
    } else if (input.id === 'password' && !isValidPassword(input.value)) {
        errorMessage = 'Пароль должен быть не менее 8 символов, содержать заглавную букву, строчную букву и цифру / Password must be at least 8 characters, contain an uppercase letter, lowercase letter, and a number';
    } else if (validity.rangeOverflow) {
        let max = input.getAttribute('max');
        errorMessage = 'Максимальное значение не может быть больше чем / The maximum value cannot be greater than ' + max;
    } else if (validity.rangeUnderflow) {
        let min = input.getAttribute('min');
        errorMessage = 'Минимальное значение не может быть меньше чем / The minimum value cannot be less than ' + min;
    }

    // Если есть сообщение об ошибке, добавляем его в массив и выводим под полем
    if (errorMessage) {
        errors.push(errorMessage);
        displayError(input, errorMessage);
    }
}

// Проверка на заглавные буквы в имени и фамилии
function isValidName(name) {
    const namePattern = /^[A-ZА-Я][a-zа-я]+\s[A-ZА-Я][a-zа-я]+$/;
    return namePattern.test(name);
}

// Функция проверки правильного формата e-mail и только латинских букв
function isValidEmail(email) {
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailPattern.test(email);
}

// Функция проверки правильного формата пароля
function isValidPassword(password) {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordPattern.test(password);
}

// Функция проверки выбора пола (радиокнопки). Если не выбрано ни одно значение, в массив ошибок добавляется соответствующее сообщение.
function checkGenderSelection() {
    let genderInputs = document.querySelectorAll('input[name="gender"]');
    let selected = false;
    genderInputs.forEach(input => {
        if (input.checked) {
            selected = true;
        }
    });

    // Очистка предыдущих ошибок для поля выбора пола
    // Логика очистки предыдущих сообщений об ошибках, чтобы не было дублирования.
    let genderFieldset = document.querySelector('.form__personalInfo_inputGender');
    let errorElement = genderFieldset.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }

    if (!selected) {
        displayError(genderFieldset, 'Выберите пол / Please select your gender');
        errors.push('Выберите пол / Please select your gender');
    }
}

// Проверка радиокнопок для пола на изменение
document.querySelectorAll('input[name="gender"]').forEach(radio => {
    radio.addEventListener('change', checkGenderSelection);
});

// Функция проверки выбора профессии
function checkProfessionSelection() {
    let professionSelect = document.querySelector('#professionSelect');
    
    // Очистка предыдущих сообщений об ошибках
    // Логика очистки предыдущих сообщений об ошибках, чтобы не было дублирования.
    let errorElement = professionSelect.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.remove();
    }

    if (professionSelect.value === '') {
        displayError(professionSelect, 'Вы не выбрали профессию / You did not select a profession');
        errors.push('Вы не выбрали профессию / You did not select a profession');
    }
}

// Добавление функционала для показа/скрытия пароля
// Добавлен чекбокс рядом с полем для пароля, который позволяет пользователю увидеть, 
// что он вводит (переключает тип поля с password на text и обратно).
let togglePasswordCheckbox = document.createElement('input');
togglePasswordCheckbox.type = 'checkbox';
togglePasswordCheckbox.id = 'togglePassword';
let togglePasswordLabel = document.createElement('label');
togglePasswordLabel.setAttribute('for', 'togglePassword');
togglePasswordLabel.textContent = 'Показать пароль / Show password';

passwordInput.insertAdjacentElement('afterend', togglePasswordCheckbox);
togglePasswordCheckbox.insertAdjacentElement('afterend', togglePasswordLabel);

togglePasswordCheckbox.addEventListener('change', function () {
    if (togglePasswordCheckbox.checked) {
        passwordInput.type = 'text'; // Показываем пароль
    } else {
        passwordInput.type = 'password'; // Скрываем пароль
    }
});

// Функция проверки согласия на обработку данных (чекбокс). Если он не установлен, добавляется сообщение об ошибке.
function checkAgreement() {
    let agreement = document.querySelector('input[name="agreement"]');
    if (!agreement.checked) {
        displayError(agreement, 'Необходимо согласие на обработку данных / You must agree to the terms');
        errors.push('Необходимо согласие на обработку данных / You must agree to the terms');
    }
}

// Функция проверки всех inputs
function checkAll() {
    errors = []; // происходит очистка всех предыдущих ошибок
    let inputs = document.querySelectorAll('input'); // получаем информацию по всем inputs
    
    for (let input of inputs) {   // В цикле for вставляем проверку условий по каждому input
        checkValidity (input);
    }

    checkGenderSelection(); // Проверка выбора пола
    checkProfessionSelection(); // Проверка выбора профессии
    checkAgreement(); // Проверка чекбокса согласия

    document.getElementById('errorsInfo').innerHTML = errors.join('. <br>') // Отображение ошибок
    // Запись массива errors, сбор ошибок и их объединение, помещает их в div errorsInfo

}

// Функция вывода ошибки под конкретным полем
function displayError(input, errorMessage) {
    let errorElement = document.createElement('div');
    errorElement.classList.add('error-message');
    errorElement.style.color = 'red';
    errorElement.innerHTML = errorMessage;
    input.insertAdjacentElement('afterend', errorElement);
}



// Вывод ошибок под полями:

// Функция displayError() создает элемент <div> после поля, где была найдена ошибка, и выводит сообщение об ошибке.
// Ошибки теперь выводятся непосредственно под каждым полем ввода, где были обнаружены ошибки, а не в общем блоке.
// Если у поля уже есть сообщение об ошибке, оно сначала удаляется, чтобы не было дублирования сообщений.

// Функция проверки всех inputs
// function checkAll() {
//     errors = [];
//     inputs.forEach(input => {
//         checkValidity(input);
//     });
//     document.getElementById('errorsInfo').innerHTML = errors.join('. <br>');
//     toggleSubmitButton();
// }

// Активация/деактивация кнопки отправки
function toggleSubmitButton() {
    let allValid = formElement.checkValidity();
    submitButton.disabled = !allValid;
}

// Обработчики focus и blur
inputs.forEach(input => {
    input.addEventListener('focus', function () {
        input.classList.add('focused');
    });
    input.addEventListener('blur', function () {
        checkValidity(input);
        input.classList.remove('focused');
    });
});

// Проверка при изменении чекбокса
document.getElementById('agreement').addEventListener('change', toggleSubmitButton);

// Включение/выключение кнопки в зависимости от валидации
formElement.addEventListener('input', function () {
    if (errors.length === 0) {
        submitButton.disabled = false;
    } else {
        submitButton.disabled = true;
    }
});