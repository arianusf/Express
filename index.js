const express = require('express'); 
const fs = require('node:fs');
const app = express(); 
const port = 5000; 

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

app.get('/json', (req, res) => {
  res.sendFile('data.json', { root: __dirname });
});

app.get('/setJson', (req, res) => {

  const content = `{
     "name":${Math.random()*100}
}`;

  fs.writeFile('./data.json', content, (err) => {
    if (err) {
        console.log(err)
        res.send('no');
    } else {
        res.send('yes');
    }
  });
});

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});
