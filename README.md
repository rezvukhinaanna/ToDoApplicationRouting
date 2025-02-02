### `npm start` - запуск приложения

Переработанное приложение Список дел с JSON Server, без использования Firebase:

Использован React Router;
"/" — Главная страница с самим списком дел (задач):
на карточке одной задачи  только одна строчка текста задачи, если текста больше, то он должен обрезаться знаком ... (многоточие) на конце строчки;
при нажатии на текст задачи открывается страница этой задачи с полным описанием;
перенесены возможности редактирования и удаления задачи на страницу задачи, с главной страницы эти возможности убрать;
на главной странице помимо списка дел остался функционал добавления новой задачи, поиск и сортировка;
"/task/<id-задачи>" — страница задачи:
на месте "" ID, сгенерированный JSON Server при создании задачи;
на странице задачи есть кнопка "Назад" ( в виде стрелки), нажав на которую открывается предыдущая страница, с которой была открыта страница задачи;
при попытке перейти по любому некорректному адресу отображается страница с ошибкой 404 и адресом "/404".
