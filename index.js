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
        // Вывод в консоль всех значений формы (если форма валидна)
        console.log("Форма отправлена! / Form submitted successfully!");
        inputs.forEach(input => console.log(`${input.name || input.id}: ${input.value}`));
        formElement.reset(); // Очистка формы
        submitButton.disabled = true;
    }
});

// 3. Функция проверки каждого одиночного поля ввода информации (только для input)
function checkValidity(input) {
    let validity = input.validity; // input.validity - где validity это свойство input, которое встроено в HTML5
    let errorMessage = ''; // Сообщение об ошибке для каждого поля при валидации
    // Очистка предыдущих сообщений об ошибках
    let errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.remove();
    }
    if (validity.valueMissing) {
        errorMessage = 'Поле ввода / Input: ' + input.placeholder + ' не заполнено / is not filled.';
    } else if (input.id === 'name' && !isValidName(input.value)) {
        errorMessage = 'Имя и фамилия должны начинаться с заглавных букв / First and last name must start with uppercase letters.';
    } else if (input.type === "email" && !isValidEmail(input.value)) {
        errorMessage = 'Неверный формат электронной почты / Invalid email format.';
    } else if (validity.patternMismatch) {
        errorMessage = 'Неверный формат заполнения / Invalid format for filling.';
    } else if (input.id === 'age' && (input.value < 1 || input.value > 110)) {
        errorMessage = 'Возраст должен быть в пределах от 1 до 110 лет / Age must be between 1 and 110';
    } else if (input.id === 'password' && !isValidPassword(input.value)) {
        errorMessage = 'Пароль должен быть не менее 8 символов, содержать не менее 1 заглавной буквы, 1 строчной буквы и 1 цифры / Password must be at least 8 characters, minimum contain 1 uppercase letter, 1 lowercase letter, and a 1 number.';
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

    console.log(`Проверяем поле: ${input.name || input.id}, значение: ${input.value}`);
    if (!input.value.trim()) {
        errors.push(`Поле "${input.name || input.id}" не должно быть пустым.`);
        console.log(`Ошибка: Поле "${input.name || input.id}" не заполнено.`);
    }
}

// Функция проверки выбора пола (радиокнопки). Если не выбрано ни одно значение, в массив ошибок добавляется соответствующее сообщение.
function checkGenderSelection() {
    let genderInputs = document.querySelectorAll('input[name="gender"]');
    let selected = false;

    // Проверка, выбран ли хотя бы один вариант/значение радиокнопок
    genderInputs.forEach(input => {
        if (input.checked) {
            selected = true;
        }
    });

    // Получаем элемент, в котором выводим ошибку
    let genderFieldset = document.querySelector('.form__personalInfo_inputGender');

    // Очистка предыдущего сообщения об ошибке, если оно есть
    let errorElement = genderFieldset.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove(); // Удаляем сообщение об ошибке с интерфейса
    }

    // Если ни один вариант не выбран, показываем ошибку
    if (!selected) {
        displayError(genderFieldset, 'Выберите пол / Please select your gender.');
        errors.push('Выберите пол / Please select your gender.');
        console.log("Ошибка: Пол не выбран.");
    } else {
        // Если был выбор, удаляем ошибку из массива ошибок
        let errorIndex = errors.indexOf('Выберите пол / Please select your gender.');
        if (errorIndex !== -1) {
            errors.splice(errorIndex, 1);
        }
        console.log(`Выбран пол: ${genderInputs[0].checked ? genderInputs[0].value : genderInputs[1].value}`);
    }

    // Добавление логики для удаления ошибки при изменении выбора радиокнопок
    genderInputs.forEach(input => {
        input.addEventListener('change', () => {
            let errorElement = genderFieldset.querySelector('.error-message');
            if (errorElement) {
                errorElement.remove();
            }
        });
    });
}


// Добавление логики удаления ошибки при изменении радиокнопок
// document.querySelectorAll('input[name="gender"]').forEach(input => {
//     input.addEventListener('change', () => {
//         let genderFieldset = document.querySelector('.form__personalInfo_inputGender');
//         let errorElement = genderFieldset.querySelector('.error-message');
        
//         // Удаляем сообщение об ошибке с интерфейса
//         if (errorElement) {
//             errorElement.remove();
//         }

//         // Удаляем ошибку из массива ошибок
//         let errorIndex = errors.indexOf('Выберите пол / Please select your gender.');
//         if (errorIndex !== -1) {
//             errors.splice(errorIndex, 1);
//         }

//         toggleSubmitButton(); // Обновляем состояние кнопки отправки
//     });
// });

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
        displayError(professionSelect, 'Вы не выбрали профессию / You did not select a profession.');
        errors.push('Вы не выбрали профессию / You did not select a profession.');
    }

    if (professionSelect.value === "") {
        errors.push("Выберите профессию.");
        console.log("Ошибка: Профессия не выбрана.");
    } else {
        console.log(`Выбрана профессия: ${professionSelect.value}`);
    }
}

// Функция проверки согласия на обработку данных (чекбокс). Если он не установлен, добавляется сообщение об ошибке.
function checkAgreement() {
    let agreement = document.querySelector('input[name="agreement"]');
    let errorElement = agreement.nextElementSibling; // Пытаемся найти следующее сообщение об ошибке, если оно существует

    // Удаляем предыдущее сообщение об ошибке, если оно есть
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.remove();
    }

    // Если чекбокс не отмечен, добавляем сообщение об ошибке
    if (!agreement.checked) {
        displayError(agreement, 'Необходимо согласие на обработку данных / You must agree to the terms.');
        errors.push('Необходимо согласие на обработку данных / You must agree to the terms.');
    }

    const agreementCheckbox = document.getElementById('agreement'); // Предполагаем, что у вас есть чекбокс согласия
    if (!agreementCheckbox.checked) {
        errors.push("Необходимо согласие с условиями.");
        console.log("Ошибка: Согласие не получено.");
    } else {
        console.log("Согласие получено.");
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

// Проверка радиокнопок для пола на изменение
document.querySelectorAll('input[name="gender"]').forEach(radio => {
    radio.addEventListener('change', checkGenderSelection);
});

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


// Функция проверки всех inputs
function checkAll() {
    errors = []; // происходит очистка всех предыдущих ошибок
    // let inputs = document.querySelectorAll('input'); // получаем информацию по всем inputs
    document.getElementById('errorsInfo').innerHTML = ''; // Очистка блока с ошибками

    console.log("Начинаем проверку всех полей...");
    
    for (let input of inputs) {   // В цикле for вставляем проверку условий по каждому input
        checkValidity (input);
    }

    checkGenderSelection(); // Проверка выбора пола
    checkProfessionSelection(); // Проверка выбора профессии
    checkAgreement(); // Проверка чекбокса согласия


    document.getElementById('errorsInfo').innerHTML = errors.join(' <br>') // Отображение ошибок
    // Запись массива errors, сбор ошибок и их объединение, помещает их в div errorsInfo

    // Отображение ошибок
    if (errors.length > 0) {
        document.getElementById('errorsInfo').innerHTML = errors.join(' <br>'); // Выводим ошибки
        console.log("Обнаружены ошибки: ", errors);
    } else {
        console.log("Ошибок не найдено.");
    }

}

// Функция вывода ошибки под конкретным полем
function displayError(input, errorMessage) {
    let errorElement = document.createElement('div');
    errorElement.classList.add('error-message');
    errorElement.style.color = 'red';
    errorElement.innerHTML = errorMessage;
    // Вставляем сообщение сразу после элемента input или fieldset
    input.insertAdjacentElement('afterend', errorElement);
}

// Функция для управления состоянием кнопки отправки
function toggleSubmitButton() {
    let formIsValid = errors.length === 0; // Если ошибок нет, форма валидна
    submitButton.disabled = !formIsValid; // Отключаем кнопку, если форма не валидна
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

// document.querySelectorAll('input[name="gender"]').forEach(radio => {
//     radio.addEventListener('blur', checkGenderSelection);
// });

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



// вызов функции проверки
document.getElementById('submit-btn').addEventListener('click', (event) => {
    event.preventDefault(); // Предотвращаем стандартное поведение
    checkGenderSelection(); // Запускаем проверку
    toggleSubmitButton(); // Проверяем состояние кнопки
});