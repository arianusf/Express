const express = require('express');
const { JsonDB, Config } = require('node-json-db');
var cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
const port = 5000;

var db = new JsonDB(new Config('data', true, false, '/'));

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

app.get('/json', (req, res) => {
    res.sendFile('data.json', { root: __dirname });
});

//shopping

app.get('/shopping/', async (req, res) => {
    try {
        var data = await db.getData('/shopping');
        res.send({ values: data });
    } catch (e) {
        res.send({ error: e });
    }
});

app.get('/shopping/:cat', async (req, res) => {
    if (req?.params?.cat) {
        const cat = req.params.cat.toLowerCase().replaceAll(' ', '');
        try {
            var data = await db.getData('/shopping');
            res.send({ values: data.filter((x) => x.owner.toLowerCase() === cat) });
        } catch (e) {
            res.send({ error: e });
        }
    }
});

app.post('/shopping/:cat', async (req, res) => {
    const item = req?.body?.name;
    if (req?.params?.cat) {
        const cat = req.params.cat.toLowerCase().replaceAll(' ', '');
        if (item) {
            var data = await db.getData('/shopping');
            if (!data.find((x) => x.name === item)) {
                data.push({ owner: cat, name: item, date: new Date() });
            }
            await db.push('/shopping', data);
            res.send({ values: data });
        } else {
            res.send({ error: "can't insert item" });
        }
    }
});

app.post('/delete-shopping', async (req, res) => {
    const item = req?.body?.name;
    if (item) {
        let data = await db.getData('/shopping');
        let newData = data.filter((x) => x.name !== item);
        await db.push('/shopping', newData);
        res.send({ values: newData });
    } else {
        res.send({ error: "can't insert item" });
    }
});

//////todo

app.get('/todo/', async (req, res) => {
    if (req?.params?.cat) {
        const cat = req.params.cat.toLowerCase().replaceAll(' ', '');
        try {
            var data = await db.getData('/todo');
            res.send({ values: data });
        } catch (e) {
            res.send({ error: e.filter((x) => x.owner.toLowerCase() === cat) });
        }
    }
});

app.get('/todo/:cat', async (req, res) => {
    if (req?.params?.cat) {
        const cat = req.params.cat.toLowerCase().replaceAll(' ', '');
        try {
            var data = await db.getData('/todo');
            res.send({ values: data.filter((x) => x.owner.toLowerCase() === cat) });
        } catch (e) {
            res.send({ error: e });
        }
    }
});

app.post('/todo/:cat', async (req, res) => {
    const item = req?.body?.name;
    const maxDate = req?.body?.maxDate || null;
    if (req?.params?.cat) {
        const cat = req.params.cat.toLowerCase().replaceAll(' ', '');
        if (item) {
            var data = await db.getData('/todo');
            if (!data.find((x) => x.name === item)) {
                data.push({ owner: cat, name: item, date: new Date(), maxDate: maxDate });
            }
            await db.push('/todo', data);
            res.send({ values: data.filter((x) => x.owner.toLowerCase() === cat) });
        } else {
            res.send({ error: "can't insert item" });
        }
    }
});

app.post('/delete-todo/:cat', async (req, res) => {
    if (req?.params?.cat) {
        const cat = req.params.cat.toLowerCase().replaceAll(' ', '');
        const item = req?.body?.name;
        if (item) {
            let data = await db.getData('/todo');
            let newData = data.filter((x) => x.name !== item);
            await db.push('/todo', newData);
            res.send({ values: newData.filter((x) => x.owner.toLowerCase() === cat) });
        } else {
            res.send({ error: "can't insert item" });
        }
    }
});

/////
app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});
