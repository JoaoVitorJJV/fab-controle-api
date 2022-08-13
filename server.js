import app from "./src/app.js";

var port = process.env.PORT || 3003;

app.listen(port, () => {
    console.log(`Conexão iniciada em: http://localhost:${port}`)
})

