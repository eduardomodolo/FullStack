// inclui o módulo http
var http = require('http');
// inclui o módulo express
var express = require('express' ) ;

// cria a variável app, pela qual acessaremos
// os métodos / funções existentes no framework
// express
var app = express () ;

// método use() utilizado para definir em qual
// pasta estará o conteúdo estático
app. use (express.static('./public' ));

// cria o servidor
var server = http.createServer(app);

// define o número da porta que o servidor ouvirá
server.listen(3000);

// mensagem exibida no console para debug
<<<<<<< HEAD
console. log("servidor rodando... ".rainbow) ;
require("colors")
=======
console. log("servidor rodando... ") ;

//exemplo de get e post 
app.get('/Início', function(require, resposta){
    resposta.redirect('/Aula 02')
})





>>>>>>> 0dc3494d7f2c5f8a2928ba43cebb52357b122fa7
