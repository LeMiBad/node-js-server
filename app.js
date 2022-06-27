const fs = require("fs");
const express = require("express");

let user = '1';

const setUser = (id) => {
    console.log(user);
    user = id
    const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));
    data.forEach((item) => {
        if(item.auth[0] === id){
            user = item.id
        }
    })
};

// Функция которая проставляет id и возвращает данные
const updateData = () => {
    const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));
    console.log(user)
    for (let i = 0; i < data[user-1].priceListItem.length; i++) {
        data[user-1].priceListItem[i].id = `${i + 1}`;
        if (data[user-1].check < data[user-1].priceListItem[i].price){
            data[user-1].priceListItem[i].status = false
        }
    }
    fs.writeFileSync('data.json', JSON.stringify(data));
    return fs.readFileSync('data.json', 'utf-8');
};

// Функция создания нового аккаунта
const addUser = (login, password) => {
    const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));
    data.push({
        auth: [login, password],
        id: data.length + 1,
        priceListItem: [],
        check: 10000,
        costsListItem: []
    })
    fs.writeFileSync('data.json', JSON.stringify(data));
}

// Функция для возвращения данных в исходное положение
const returnData = () => {
    const data = [
        {
            auth: ['admin', 'admin'],
            id: 1,
            priceListItem: [
            { id: '1', url: "", name: "Кровля", price: "9500", status: true },
            { id: '2', url: "", name: "Металл", price: "3000", status: true },
            { id: '3', url: "", name: "Кисть", price: "3000", status: true },
            { id: '4', url: "", name: "Бетон", price: "3000", status: true },
            { id: '5', url: "", name: "Краска", price: "1500", status: true },
            { id: '6', url: "", name: "Кровля", price: "9500", status: true },
            { id: '7', url: "", name: "Металл", price: "3000", status: true },
            { id: '8', url: "", name: "Кисть", price: "500", status: true },
            { id: '9', url: "", name: "Бетон", price: "500", status: true },
            { id: '10', url: "", name: "Краска", price: "1500", status: true },
        ],
        check: 30000,
        costsListItem: [
        ]},
        {
            auth: ['second', 'second'],
            id: 2,
            priceListItem: [
            { id: '1', url: "", name: "грунтовка", price: "1200", status: true },
            { id: '2', url: "", name: "кисть", price: "800", status: true },
            { id: '3', url: "", name: "маска", price: "150", status: true },
        ],
        check: 3000,
        costsListItem: [
        ]},
        {
            auth: ['one', 'free'],
            id: 3,
            priceListItem: [
            { id: '1', url: "", name: "Что-то", price: "15", status: true },
            { id: '2', url: "", name: "Что-то", price: "15", status: true },
            { id: '3', url: "", name: "Что-то", price: "15", status: true },
            { id: '4', url: "", name: "Что-то", price: "15", status: true },
            { id: '5', url: "", name: "Что-то", price: "15", status: true },
        ],
        check: 300,
        costsListItem: [
        ]}
    ]
    fs.writeFileSync("data.json", JSON.stringify(data));
};

returnData()
// Функция для добавления купленного расхода
const addCostsListItem = (price, name) => {
    const new_data = JSON.parse(updateData(user))
    new_data[user-1].costsListItem.unshift({price: price, name: name})
    fs.writeFileSync('data.json', JSON.stringify(new_data))
}

// Функция добавления нового расхода
const addPriceListItem = (url, name, price) => {
    const new_data = JSON.parse(updateData(user));
    new_data[user - 1].priceListItem.unshift({
        id: "11",
        url: url,
        name: name,
        price: price,
        status: true,
    });
    fs.writeFileSync("data.json", JSON.stringify(new_data));
};

// Функция удаления расхода
const deletePriceListItem = (id) => {
    old_data = JSON.parse(updateData(user));
    new_data = old_data;
    new_data[user-1].priceListItem = old_data[user-1].priceListItem.filter(
        (item) => item.id !== id
    );
    fs.writeFileSync("data.json", JSON.stringify(new_data));
};

// Функция покупки
const purshase = (price, id, user) => {
    old_data = JSON.parse(updateData(user));
    new_data = old_data;
    new_data[user-1].check = old_data[user-1].check - price;
    new_data[user-1].priceListItem = old_data[user-1].priceListItem.filter((item) => item.id !== id) 
    fs.writeFileSync("data.json", JSON.stringify(new_data))
}


// Непосредственно создание сервера
const app = express();
const port = 3100;

app.listen(port, () => {
    console.log("Сервер запущен");
});

// Функции которые отслеживают гет запросы

app.get("/", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    setUser(req.query.userId);
    res.end(updateData(user));
});

app.get("/delete", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    deletePriceListItem(req.query.id);
    res.end(updateData(user));
    console.log('Совершено удаление расхода')
});

app.get("/add", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    setUser(req.query.userId);
    addPriceListItem(req.query.url, req.query.name, req.query.price);
    res.end(updateData(user));
    console.log('Совершено добавление расхода')
});

app.get("/addUser", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    addUser(req.query.login, req.query.password)
    setUser(JSON.parse(updateData(user)).length);
    res.end(updateData(user));
    console.log('Совершена регистрация нового пользователя')
});

app.get("/purshase", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    setUser(req.query.userId);
    purshase(req.query.price, req.query.id, user);
    addCostsListItem(req.query.price, req.query.name, user)
    res.end(updateData(user));
    console.log('Совершена покупка')
});
