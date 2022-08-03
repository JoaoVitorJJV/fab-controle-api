import app from "./src/app.js";

var port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Conexão iniciada em: http://localhost:${port}`)
})

