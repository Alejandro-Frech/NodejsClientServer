/**
 * Created by AlejandroFrech on 11/23/2015.
 */
var User = require("./User.js")
var FileManager = require("./FileManager");

require('net').createServer(function (socket) {
        console.log("connected");
        socket.on('data', function (data) {
            var fm= new FileManager();
            console.log(data.toString());
            var tokens=data.toString().split("\n")
            if(tokens[0]==='Add'){
                var x=fm.writeUser(tokens[1]);
                socket.write('Yes','utf8');
            }
            if(tokens[0]==="ShowUser"){
                var user= fm.searchUser(tokens[1]);
                socket.write(user,'utf8');
            }
            if(tokens[0]==="DeleteUser"){
                var users= fm.getUsers();
                console.log(users.toString());
                var userlist= users.split("\n");
                console.log(userlist);
                fm.reWriteFile();
                for(var i=0;i<userlist.length;i++){
                    var tok=userlist[i].split(",");
                    if(tokens[1]!=tok[0]){
                        fm.writeUser(userlist[i]);
                    }
                }
                socket.write('Yes','utf8');
            }
            if(tokens[0]==="SendEmail"){
                var users=fm.searchUser(tokens[1]);
                var userlist= users.split(",")
                var api_key = 'key-410b4bd9be9ab2241c624fd0a6bd35bf';
                var domain = 'sandbox001786de44a44eec898cd90610e9097d.mailgun.org';
                var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
                var data = {
                    from: 'ClientServe@info.com',
                    to: tokens[2],
                    subject: 'Contact Information',
                    html: '<body> <p>---------------ContactInfo-----------<br></p> <p> Username :'+userlist[0]+'<p> Name :'+userlist[1]+' </p> <p>Email :'+userlist[2]+'</p> <p>Identity Card :'+userlist[3]+'</p> <p>Birth Date :'+userlist[4]+'</p> <h2>Profile picture</h2> <img src='+userlist[5]+'style=width:128px;height:128px;> </body>'
                };
                var res=' ';
                mailgun.messages().send(data, function (error, body) {
                    console.log(body);
                    res='Yes';
                    socket.write(res,'utf8');
                });

            }

        });
        process.on('uncaughtException', function (err) {
            console.log(err);
        });

        socket.on('close',function(data){
            console.log(data);
        });

    })
    .listen(8888);