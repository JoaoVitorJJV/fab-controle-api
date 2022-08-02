import app from "./src/app.js";

var port = process.env.PORT || 5000;

if(port == 5000){
    port = 4000
}else{
    port = 5000
}

app.listen(port, () => {
    console.log(`Conexão iniciada em: http://localhost:${port}`)
})

