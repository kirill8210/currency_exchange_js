const currencyList = document.querySelector('.currency_list');
const currencySearch = document.getElementById('currency_search');
const currencyChart = document.querySelector('.currency_chart');
currencyChart.classList.add('currency_hidden');
const currencyTable = document.querySelector('.currency_table');
currencyTable.classList.add('currency_hidden');
currencyTable.style.border = '0px';
let result = [];
let now = new Date();
let time = now.getTime();
now = new Date(time - (time % 86400000));
let lastDays = [];
let tableDays = [];

for (let i = 0; i < 8; i++, now.setDate(now.getDate() - 1)) {
    lastDays.push(now.getFullYear() + '' + ((now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1)) + '' + ((now.getDate() +1 ) < 10 ? '0' + (now.getDate() + 1) : (now.getDate() + 1)));
    tableDays.push(((now.getDate() +1 ) < 10 ? '0' + (now.getDate() + 1) : (now.getDate() + 1)) + '.' + ((now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1)) + '.' +  now.getFullYear());
}

const rates = lastDays.splice(1, 7).reverse();
const ratesTable = tableDays.splice(1, 7).reverse();
const ratesNow = now.getFullYear() + '' + ((now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1)) + '' + ((now.getDate() + 8)  < 10 ? '0' + (now.getDate() + 8) : (now.getDate() + 8) );

currencySearch.addEventListener('change', updateChart);

const oneExchange = (data) => {
    const {
        cc,
        rate
    } = data;
    const card = document.createElement('div');

    card.insertAdjacentHTML('afterbegin', `
        <div class="list_item">
            <span>${cc}</span>
            <span>${Math.round(rate*100)/100}</span>            
        </div>            
    `);

    return card;
};

const getData = () =>{
    fetch(`https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${ratesNow}&json`)
        .then(res => res.json())
        .then(data =>{
            const myRates = ['USD', 'GBP', 'EUR', 'PLN'];
            const options = data.filter(data => myRates.includes(data.cc));
            const cards = options.map(oneExchange);
            currencyList.append(...cards);
        });
};
getData();




const rateData = (value) => {

    const toURI = date => `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${date}&json`;
    const requests = rates.map(date => fetch(toURI(date))
        .then(response => response.json()));
    const ratesByDates = Promise.all(requests);

    ratesByDates.then(
        data => {
            for (let i = 0; i < data.length; i++) {
                result.push(data[i][value].rate);
            }

            const label = currencySearch.options[currencySearch.selectedIndex].text;
            myChart.data.datasets[0].label = label;
            myChart.data.datasets[0].data = result;
            myChart.update();

            const arr3 = data.reduce((acc, el, i) => {
                return [
                    ...acc,
                    {
                        name: data[i][value].rate,
                        date: data[i][value].exchangedate,
                    },
                ];

            }, []);

            const fragment = document.createDocumentFragment();
            arr3.forEach(arr3 => {
                const div = listItemTemplate(arr3);
                fragment.appendChild(div);
            });

            currencyTable.appendChild(fragment);

        }
    );

};

function updateChart() {
    let value = currencySearch.value;
    if (value){
        rateData(value);
        currencyTable.textContent = '';
        currencyTable.classList.remove('currency_hidden');
        currencyTable.style.border = '1px solid #999';
        currencyChart.classList.remove('currency_hidden');
        result = [];
    } else {
        currencyTable.textContent = '';
        currencyTable.style.border = '0';
        currencyChart.classList.add('currency_hidden');
        currencyTable.classList.add('currency_hidden');
    }
}

const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ratesTable,
        datasets: [{
            label: '',
            data: [12, 19, 3, 5, 2, 3, 8],
            backgroundColor: [
                '#dfcbfb'
            ],
            borderColor: [
                '#964fff'
            ]
        }]
    },
    options: {}
});

function listItemTemplate({name, date} = {}) {

    const div = document.createElement('div');
    div.classList.add('table_row');

    const tableDate = document.createElement('div');
    tableDate.classList.add('table_column2');

    const rowData = document.createElement('div');
    rowData.classList.add('table_column');
    rowData.textContent = date;

    const tableRate = document.createElement('div');
    tableRate.classList.add('table_column2');

    const rowRate = document.createElement('div');
    rowRate.classList.add('table_column');
    rowRate.textContent = name;

    tableRate.append(rowRate);
    tableDate.append(rowData);

    div.append(tableDate, tableRate);
    currencyTable.append(div);

    return div;
}
