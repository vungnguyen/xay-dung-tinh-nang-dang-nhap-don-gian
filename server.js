const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('qs');
const server  = http.createServer((req, res) => {
        //get url and parse
        let parseUrl = url.parse(req.url, true);
        //
        // //get the path
        let path = parseUrl.pathname;
        let trimPath = path.replace(/^\/+|\/+$/g, '');

        let method = req.method.toLowerCase();

        if(method==='get'){
            let chosenHandler = (typeof (router[trimPath]) !== 'undefined') ? router[trimPath] : handlers.notFound;
            chosenHandler(req, res);
        }
        else{
            let chosenHandler = router.profile;
            chosenHandler(req, res);
        }
    });


    server.listen(3000, function () {
        console.log('server running at http://localhost:3000 ')
    });

    let handlers = {};
// form login
    handlers.login = function (rep, res) {
        fs.readFile('./views/login.html', function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            return res.end();
        });
    };
// home page
    handlers.home = function (rep, res) {
        fs.readFile('./views/home.html', function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            return res.end();
        });
    };

// not found
    handlers.notFound = function (rep, res) {
        fs.readFile('./views/notfound.html', function(err, data) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.write(data);
            return res.end();
        });
    };
// profile
    handlers.profile = function (req, res){
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        })
        req.on('end', () => {
            data= qs.parse(data);
            let name = data.name;
            let stringObject = "<h1>Hello " + name+ "</h1>";
            console.log(name);
            fs.writeFile('./views/profile.html', stringObject,  function(err) {
                if (err) {
                    return console.error(err);
                }
                console.log("Ghi du lieu vao file thanh cong!");
                console.log("Doc du lieu vua duoc ghi");
                fs.readFile('./views/profile.html', function (err, data) {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(data);
                    return res.end();
                });
            });
        });
    }
//definer the request router
    let router = {
        'home': handlers.home,
        'login': handlers.login,
        'profile':handlers.profile
    }
