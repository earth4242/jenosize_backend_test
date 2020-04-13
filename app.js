var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'src'),{index:false})); //fix call root path with middleware

var host = require('./configuration/webhost')
var request = require('request')
app.get('/getplace' , async function (req , res , next) {
  if(req.query.text){
    var url = req.url;
    var urlsplit = url.split('text=')
    text = urlsplit[1];
    let headers = {
        'Content-Type': 'application/json'
    }
    await request.get({
        url: "https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+or+food+in+"+text+"&key="+host.place_api,
        headers: headers
    }, (err, ress, body) => {
        var getres = "ไม่สามารถค้นหาได้ กรุณาเปลี่ยนคำค้นหาใหม่";
        if(body!=undefined) getres = JSON.parse(body);
        res.json(getres);
    });
  }else{
    res.json({ status : "wrong params"});
  }
});

var calculator = require('calculator')
app.get('/game24' , async function (req , res , next) {
  if(Number(req.query.x1)>=1&&Number(req.query.x2)>=1&&Number(req.query.x3)>=1&&Number(req.query.x4)>=1&&Number(req.query.x1)<=9&&Number(req.query.x2)<=9&&Number(req.query.x3)<=9&&Number(req.query.x4)<=9){
    var x1 = Number(req.query.x1),x2=Number(req.query.x2),x3=Number(req.query.x3),x4=Number(req.query.x4);
    var solute={ pattern1 : { style : 'a _ b _ ( c _ d )' , list : [] } , pattern2 : { style : '( a _ b ) _ c _ d' , list : [] } , pattern3 : { style : '( a _ b ) _ ( c _ d )' , list : [] } , pattern4 : { style : 'a _ ( b _ c _ d )',list:[] } , pattern5 : { style : '( a _ b _ c ) _ d' , list:[] } , pattern6 : { style : 'a _ b _ c _ d' , list:[] } , pattern7 : { style : 'a _ ( b _ c ) _ d' , list:[] } , pattern8 : { style : 'a _ ( ( b _ c ) _ d )' , list:[] } , pattern9 : { style : 'a _ ( b _ ( c _ d ) )' , list:[] } , pattern10 : { style : '( a _ ( b _ c ) ) _ d' , list:[] } , pattern11 : { style : '( ( a _ b ) _ c ) _ d' , list:[] } };

    var temppattern;
    function searchpattern(element) {
      return element == temppattern;
    }
    var input = [x1,x2,x3,x4],boolsolution=false;

    async function withlibrary() {
      for (var i = 0; i < 4; i++) {
        var tempinput = []
        for (var z = 0; z < input.length; z++) {
          tempinput.push(input[z])
        }
        var mainvalue = input[i] ;
        tempinput.splice(i,1);
        var splicevalue = tempinput;
        for (var j = 0; j < 6; j++) {
          if(i>0){
            var tempshift = splicevalue[2];
            splicevalue.pop();
            splicevalue.unshift(tempshift);
          }
          if(j==3){
            var tempswitch = splicevalue[2];
            splicevalue[2] = splicevalue[1];
            splicevalue[1] = tempswitch;
          }
          var operator = ['','','']
          for (var a = 0; a < 4; a++) {
            for (var b = 0; b < 4; b++) {
              for (var c = 0; c < 4; c++) {
                switch (a) {
                  case 0 : operator[0]='+'; break;
                  case 1 : operator[0]='-'; break;
                  case 2 : operator[0]='*'; break;
                  case 3 : operator[0]='/'; break;
                }6
                switch (b) {
                  case 0 : operator[1]='+'; break;
                  case 1 : operator[1]='-'; break;
                  case 2 : operator[1]='*'; break;
                  case 3 : operator[1]='/'; break;
                }
                switch (c) {
                  case 0 : operator[2]='+'; break;
                  case 1 : operator[2]='-'; break;
                  case 2 : operator[2]='*'; break;
                  case 3 : operator[2]='/'; break;
                }
                //pattern1
                temppattern = mainvalue+operator[0]+splicevalue[0]+operator[1]+'('+splicevalue[1]+operator[2]+splicevalue[2]+')'
                caltemppattern = 'f(x) = x*('+temppattern+')'
                var getvalue = calculator.func(caltemppattern)
                if(24==getvalue(1)){
                  var getindex = await solute.pattern1.list.findIndex(searchpattern);
                  if(getindex==(-1)) solute.pattern1.list.push(temppattern);
                  boolsolution=true;
                }
                //pattern2
                temppattern = '('+mainvalue+operator[0]+splicevalue[0]+')'+operator[1]+splicevalue[1]+operator[2]+splicevalue[2]
                caltemppattern = 'f(x) = x*('+temppattern+')'
                var getvalue = calculator.func(caltemppattern)
                if(24==getvalue(1)){
                  var getindex = await solute.pattern2.list.findIndex(searchpattern);
                  if(getindex==(-1)) solute.pattern2.list.push(temppattern);
                  boolsolution=true;
                }
                //pattern3
                temppattern = '('+mainvalue+operator[0]+splicevalue[0]+')'+operator[1]+'('+splicevalue[1]+operator[2]+splicevalue[2]+')'
                caltemppattern = 'f(x) = x*('+temppattern+')'
                var getvalue = calculator.func(caltemppattern)
                if(24==getvalue(1)){
                  var getindex = await solute.pattern3.list.findIndex(searchpattern);
                  if(getindex==(-1)) solute.pattern3.list.push(temppattern);
                  boolsolution=true;
                }
                //pattern4
                temppattern = mainvalue+operator[0]+'('+splicevalue[0]+operator[1]+splicevalue[1]+operator[2]+splicevalue[2]+')'
                caltemppattern = 'f(x) = x*('+temppattern+')'
                var getvalue = calculator.func(caltemppattern)
                if(24==getvalue(1)){
                  var getindex = await solute.pattern4.list.findIndex(searchpattern);
                  if(getindex==(-1)) solute.pattern4.list.push(temppattern);
                  boolsolution=true;
                }
                //pattern5
                temppattern = '('+mainvalue+operator[0]+splicevalue[0]+operator[1]+splicevalue[1]+')'+operator[2]+splicevalue[2]
                caltemppattern = 'f(x) = x*('+temppattern+')'
                var getvalue = calculator.func(caltemppattern)
                if(24==getvalue(1)){
                  var getindex = await solute.pattern5.list.findIndex(searchpattern);
                  if(getindex==(-1)) solute.pattern5.list.push(temppattern);
                  boolsolution=true;
                }
                //pattern6
                temppattern = mainvalue+operator[0]+splicevalue[0]+operator[1]+splicevalue[1]+operator[2]+splicevalue[2]
                caltemppattern = 'f(x) = x*('+temppattern+')'
                var getvalue = calculator.func(caltemppattern)
                if(24==getvalue(1)){
                  var getindex = await solute.pattern6.list.findIndex(searchpattern);
                  if(getindex==(-1)) solute.pattern6.list.push(temppattern);
                  boolsolution=true;
                }
                //pattern7
                temppattern = mainvalue+operator[0]+'('+splicevalue[0]+operator[1]+splicevalue[1]+')'+operator[2]+splicevalue[2]
                caltemppattern = 'f(x) = x*('+temppattern+')'
                var getvalue = calculator.func(caltemppattern)
                if(24==getvalue(1)){
                  var getindex = await solute.pattern7.list.findIndex(searchpattern);
                  if(getindex==(-1)) solute.pattern7.list.push(temppattern);
                  boolsolution=true;
                }
                //pattern8
                temppattern = mainvalue+operator[0]+'('+'('+splicevalue[0]+operator[1]+splicevalue[1]+')'+operator[2]+splicevalue[2]+')'
                caltemppattern = 'f(x) = x*('+temppattern+')'
                var getvalue = calculator.func(caltemppattern)
                if(24==getvalue(1)){
                  var getindex = await solute.pattern8.list.findIndex(searchpattern);
                  if(getindex==(-1)) solute.pattern8.list.push(temppattern);
                  boolsolution=true;
                }
                //pattern9
                temppattern = mainvalue+operator[0]+'('+splicevalue[0]+operator[1]+'('+splicevalue[1]+operator[2]+splicevalue[2]+')'+')'
                caltemppattern = 'f(x) = x*('+temppattern+')'
                var getvalue = calculator.func(caltemppattern)
                if(24==getvalue(1)){
                  var getindex = await solute.pattern9.list.findIndex(searchpattern);
                  if(getindex==(-1)) solute.pattern9.list.push(temppattern);
                  boolsolution=true;
                }
                //pattern10
                temppattern = '('+mainvalue+operator[0]+'('+splicevalue[0]+operator[1]+splicevalue[1]+')'+')'+operator[2]+splicevalue[2]
                caltemppattern = 'f(x) = x*('+temppattern+')'
                var getvalue = calculator.func(caltemppattern)
                if(24==getvalue(1)){
                  var getindex = await solute.pattern10.list.findIndex(searchpattern);
                  if(getindex==(-1)) solute.pattern10.list.push(temppattern);
                  boolsolution=true;
                }
                //pattern10
                temppattern = '('+'('+mainvalue+operator[0]+splicevalue[0]+')'+operator[1]+splicevalue[1]+')'+operator[2]+splicevalue[2]
                caltemppattern = 'f(x) = x*('+temppattern+')'
                var getvalue = calculator.func(caltemppattern)
                if(24==getvalue(1)){
                  var getindex = await solute.pattern11.list.findIndex(searchpattern);
                  if(getindex==(-1)) solute.pattern11.list.push(temppattern);
                  boolsolution=true;
                }
              }
            }
          }
        }
      }
    }

    await withlibrary(); // 11 pattern
    var str = 'NO';

    if(boolsolution) str = 'YES';
    res.json({ solution : str , pattern : solute})
  }else{
    res.json({ status : "wrong input"});
  }
});

app.get('*', (req, res,next) => {
  res.sendFile(path.join(__dirname, './src', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
