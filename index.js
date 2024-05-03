const express = require('express');
const { JsonDB, Config } = require('node-json-db');
const app = express();
app.use(express.json());
const port = 5000;

var db = new JsonDB(new Config('data', true, false, '/'));

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

app.get('/json', (req, res) => {
    res.sendFile('data.json', { root: __dirname });
});

app.get('/shopping', async (req, res) => {
    try {
        var data = await db.getData('/shopping');
        res.send({ values: data });
    } catch (e) {
        res.send({ error: e });
    }
});

app.post('/shopping', async (req, res) => {
    const item = req?.body?.name;
    if (item) {
        var data = await db.getData('/shopping');
        if (!data.find((x) => x === item)) {
            data.push(item);
        }
        await db.push('/shopping', data);
        res.send({ values: data });
    } else {
        res.send({ error: "can't insert item" });
    }
});

app.get('/todo', async (req, res) => {
    try {
        var data = await db.getData('/todo');
        res.send({ values: data });
    } catch (e) {
        res.send({ error: e });
    }
});

app.post('/todo', async (req, res) => {
    const item = req?.body?.name;
    if (item) {
        var data = await db.getData('/todo');
        if (!data.find((x) => x === item)) {
            data.push(item);
        }
        await db.push('/todo', data);
        res.send({ values: data });
    } else {
        res.send({ error: "can't insert item" });
    }
});

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});
