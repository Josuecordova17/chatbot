const { Telegraf } = require('telegraf')
const bot = new Telegraf('1876988696:AAH_TRqzBmRuvC4IsjniBJqCbAVIW72BkLE')
const mysql = require('mysql');
const { Client } = require('whatsapp-web.js');
const client = new Client();
const qrcode = require('qrcode-terminal')
var palabra=''
//Base de Datos
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database:'chatbot'
  });
  connection.connect((err)=>{
      if (!err) {
          console.log("Conexion existosa".green)
      }else {
          console.error("Conexion fallida /n Error"+JSON.stringify(err,undefined,2))
      }
  });
//Telegram
bot.start((ctx)=>{
    ctx.reply(`Hola ${ctx.from.first_name} ¿Como estas?`)
})
bot.command('/c',(ctx)=>{
    let txt = ctx.message.text
    txt=txt.slice(3,txt.length)
    console.log(txt);
    ins(txt)
    ctx.reply('Gracias')
})
bot.on('text',(ctx)=>{
    txt=pro(ctx.message.text)
    let sql = "SELECT `r` FROM `chatbot` WHERE p='"+txt+"'"
    connection.query(sql,(err,rows,fields)=>{
        if (!err) {
            if (rows=='') {
                palabra=txt
                console.log(palabra);
             ctx.reply('Manda /c y lo que deberia decir') 
            } else {
             ctx.reply(rows[0].r)   
            }
        } else {
            console.error(err);
        }
    })
})
//Whatsapp

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    qrcode.generate(qr,{small:true})
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', msg => {
    let txt = pro(msg.body)
    let c=txt.slice(0,2)
    console.log(txt);
    if (c==='/c') {
        c(msg)
    } else {
        let sql = "SELECT `r` FROM `chatbot` WHERE p='"+txt+"'"
        connection.query(sql,(err,rows,fields)=>{
            if (!err) {
                if (rows=='') {
                    palabra=txt
                    console.log(palabra);
                 msg.reply('Manda /c y lo que deberia decir') 
                } else {
                 msg.reply(rows[0].r)   
                }
            } else {
                console.error(err);
            }
        })  
    }
})
client.initialize();
//funciones
function c(msg) {
    let txt = msg.body
    txt=txt.slice(3,txt.length)
    console.log(txt);
    ins(txt)
    ctx.reply('Gracias')
}
function ins(txt) {
    connection.query('INSERT INTO `chatbot`(`p`, `r`) VALUES (?,?)',[palabra,txt],(err)=>{
        if (!err) {
            console.log("Insert exitoso");      
        } else {
        console.log(err);    
        }
    })    
}
function pro(txt) {
    let re = txt
        re= re.toLowerCase()
        re= re.trim()
        re=tildes(re)
        const r1='"'
        const r2="'"
        const re1 = new RegExp(r1,'g');
        const re2 = new RegExp(r2,'g');
        re=re.replace(re1,'')
        re=re.replace(re2,'')
        re=re.replace(/`/g,'')
        function tildes(txt) {
            //espacios
            while (txt.indexOf('  ')!=-1) {
                txt=txt.replace(' ','')   
            }
        let re;
            do {
                txt = txt.replace('á','a')
                txt = txt.replace('é','e')
                txt = txt.replace('í','i')
                txt = txt.replace('ó','o')
                txt = txt.replace('ú','u')
                 re = txt
            } while (re.indexOf('á')!=-1 || re.indexOf('é')!=-1|| re.indexOf('í')!=-1|| re.indexOf('ó')!=-1|| re.indexOf('ú')!=-1);
        return re    
        }
        return re
}
bot.launch()