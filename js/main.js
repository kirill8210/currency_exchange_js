/*
Дополнительное тестовое: разработать приложение на React
REST API https://bank.gov.ua/ua/open-data/api-dev
Приложение будет иметь несколько страниц.

Первая, текущий курс гривны по отношению к иностранным валютам

Вторая, таблица и график изменения курса гривны к выбранной через select валюте

Для интерфейса можно выбрать любую библиотеку на свой вкус
Либо что-то из
https://react.semantic-ui.com/
https://blueprintjs.com/
https://react-bootstrap.github.io/
https://material-ui.com/

 */

const app = document.querySelector('.app');
const select = document.querySelector('.app_select');

const oneExchange = (data) => {
    const {
        cc,
        rate
    } = data;
    const card = document.createElement('div');

    card.insertAdjacentHTML('afterbegin', `    
        <div>
            <div><span>${cc}</span> ${Math.round(rate*100)/100}</div>
        </div>    
    `);

    return card;
};

const getData = () =>{
    fetch(`https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json`)
        .then(res => res.json())
        .then(data =>{
            const myRates = ['USD', 'GBP', 'EUR', 'PLN'];
            const options = data.filter(data => myRates.includes(data.cc));
            const cards = options.map(oneExchange);
            app.append(...cards);
        });
};
getData();

const optionsData = (value) =>{
    fetch(`https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json`)
        .then(res => res.json())
        .then(data =>{
            //console.log(data);
            const myRates = value;
            const options = data.filter(data => myRates.includes(data.cc));
            const cards = options.map(oneExchange);
            select.append(...cards);
        });
};

const element = document.getElementById('search_choices');
element.addEventListener('change', (e) => {
    select.textContent = '';
    const value = e.target.value;
    optionsData(value);
});
