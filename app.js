const express = require("express");
require('dotenv').config({ path: './env' });
require('./connection/conn')
const hbs = require("express-handlebars");
const cookieSession = require('cookie-session')
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit')
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15minutes
    max: 100, //limit each IP to 100 requests per window
    standarHeaders: true, //return rate limit infor in the 'RateLimit'
    legacyHeaders: false, // disable the 'X-RateLimit-*' headers
});
const userRouter = require('./routers/userRouter')
const adminRouter = require('./routers/adminRouter')

const app = express();
const port = 3000;
// configure Handlebars view engine
app.engine(
    "hbs",
    hbs.engine({
        defaultLayout: "main",
        extname: '.hbs',
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
        },
        helpers: {
            when: (operand_1, operator, operand_2, options) => {
                let operators = {                     //  {{#when <operand1> 'eq' <operand2>}}
                    'eq': (l, r) => l == r,              //  {{/when}}
                    'noteq': (l, r) => l != r,
                    'gt': (l, r) => (+l) > (+r),                        // {{#when var1 'eq' var2}}
                    'gteq': (l, r) => ((+l) > (+r)) || (l == r),        //               eq
                    'lt': (l, r) => (+l) < (+r),                        // {{else when var1 'gt' var2}}
                    'lteq': (l, r) => ((+l) < (+r)) || (l == r),        //               gt
                    'or': (l, r) => l || r,                             // {{else}}
                    'and': (l, r) => l && r,                            //               lt
                    '%': (l, r) => (l % r) === 0                        // {{/when}}
                }
                let result = operators[operator](operand_1, operand_2);
                if (result) return options.fn(this);
                return options.inverse(this);
            },
            avg: (array) => {
                if (!Array.isArray(array)) {
                    return 0;
                }
                if (array.length === 0) {
                    return 0;
                }
                let sum = array.reduce((a, b) => { return a + b });
                return (sum / array.length).toFixed(1);
            },
            range: (start, end)=>{
                var result = []
                if(end%10!=0){
                    end = parseInt(end/10) + 1
                }
                for(var i = start; i <= end; i++){
                    result.push(i)
                }
                return result
            }
        }
    })
);
app.set("view engine", "hbs");
app.use(express.static(__dirname + "/public"));
app.use(cookieSession({
    name: 'auth-session',
    keys: ['key1', 'key2'],
    maxAge: 24 * 60 * 60 * 1000
}));
app.use('/', apiLimiter);
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({extended: true})); // to support URL-encoded bodies
app.use(cookieParser());
// load data into mongoose
// const Film = require('./models/filmModel');
// const data = JSON.parse(fs.readFileSync('./sourceFilms.json', 'utf-8'))


// app.use(importData);

//backup database
const { exec } = require('child_process');

// Thời gian backup định kỳ, ví dụ backup mỗi ngày lúc 12:00
const backupTime = '0 12 * * *';

// Đường dẫn đến thư mục backup
const backupDir = './connection';

// Tên database cần backup
const dbName = 'nodejs';

// Lệnh mongodump để backup database
const backupCmd = `mongodump --archive=${backupDir}/${dbName}.gz --gzip --db=${dbName}`;

// Hàm chạy lệnh backup và ghi log
function runBackup() {
    exec(backupCmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`Backup error: ${error}`);
        } else {
            console.log(`Backup successful: ${backupDir}/${dbName}.gz`);
        }
    });
}

// Tạo cron job để chạy backup định kỳ
const cron = require('node-cron');
cron.schedule(backupTime, runBackup);


app.use('/', userRouter);
app.use('/admin', adminRouter);


// custom 404 page
app.use((req, res) => {
    res.status(404);
    res.render('error');
    return;
});

app.listen(port, () =>
    console.log(
        `Express started on http://localhost:${port}; ` +
        "press Ctrl-C to terminate. "
    )
);
