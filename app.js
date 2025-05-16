var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

const sequelize = require('./configs/db.js'); // <--- เพิ่ม
require('./models/employee');  
require('./models/project');
require('./models/employee_tech_skill');
require('./models/trend');
require('./models/position');
require('./models/skill');
require('./models/prefix');
require('./models/level');
require('./models/tech_stack');   

var employeesRouter = require('./routes/empolyee.js');
var projectsRouter = require('./routes/project.js');
var employeeTechSkillRouter = require('./routes/employee_tech_skill.js');
var uploadRouter = require('./routes/upload.js');
var importRouter = require('./routes/import.js');

var app = express(); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/employees', employeesRouter);
app.use('/projects', projectsRouter);
app.use('/employee_tech_skills', employeeTechSkillRouter);
app.use('/uploads', uploadRouter); 
app.use('/imports', importRouter);

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

sequelize.sync({ alter: true }) // เปลี่ยนเป็น force: true ถ้าต้องการลบตารางแล้วสร้างใหม่
  .then(() => {
    console.log('✅ Database synced');
  })
  .catch((err) => {
    console.error('❌ Database sync failed:', err);
  });

module.exports = app;
