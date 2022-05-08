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
const currencyList = document.querySelector('.currency_list');
const selectCurrency = document.querySelector('.currency_search_list');

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
            currencyList.append(...cards);
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
            selectCurrency.append(...cards);
        });
};

const currencySearch = document.getElementById('currency_search');
currencySearch.addEventListener('change', (e) => {
    selectCurrency.textContent = '';
    const value = e.target.value;
    optionsData(value);
});
