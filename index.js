const Express = require('express');
const cors = require('cors'); //server 8000 ma host cha ni front end 7000 ma host cha.... req ra reponse milauna lai
const bodyParser = require('body-parser');
//connection factory
const knex = require('knex');

const dbConfig = require('./knexfile');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path=require('path');

//create an express instance
const express=Express();



express.use(cors());

express.use(bodyParser.json());
express.use(Express.static(path.join(__dirname, 'public')));



   //this is client connection
const dbClient= knex(dbConfig)  //bridge between database and knex which is a actual connection.

const multer = require('multer'); //to upload the image file
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/')
  },
  filename: (req, file, cb) => {
    // console.log(file.originalname);
    // console.log(file.fieldname);
    let ext=path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + '.jpg')
  }
});
var upload = multer({storage: storage}).single('imageFile');



function registerUser(request, response) {
 
    const email = request.body.email;
    const password = request.body.password;
    const userType = request.body.userType;
    
    dbClient
      .table('users')
      .insert({
        email:password,
        password:email,
        userType:userType,
      })
      .then(data => {
        response.json({
          status: 'success',
          success: true,
          data: {
            email:email
          }
        })
      })
      .catch(error => {
        response.json({
          status: 'fail',
        })
      })
  }

  // create a auth handler
function authenticate(request, response) {
  
  const email = request.body.email;
  const passwordFromJSON = request.body.password;

  dbClient
    .table('users')
    .first('password')
    .where('email',email)
    .then(data => {
      
      if (!data) {
        
        response.json({
          status: 'fail',
          message: 'User not found.'
        })
      } else {
        const password = data.password;  
        if (password == passwordFromJSON) {
            response.setHeader('Content-Type', 'application/json');
          // password matched
          response.json({
            success: true,
            status: 'success',
            email:email,
            accessToken: jwt.sign({
              email: email
            }, 'secret_key')
          })
        } else {
          response.json({
            status: 'fail',
            message: 'user not authenticated'
          })
        }
      }
      
    })
    .catch(error => {
      response.json({
        status: 'fail',
      })
    })
}

function addTrip(request, response) {

 console.log(request.body);
 const name = request.body.name;
 const price = request.body.price;
 const description = request.body.description;
 const location = request.body.location;
 const image = request.body.image;
  
  
    dbClient
    .table('trip')
    .insert({
      //this must be same for database's column
      name: name,
      price: price,
      description: description,
      location: location,
      image:image
    })
    .then(data => {
      response.json({
        status: 'success',
        data: {
          shoesName: shoesName,
        }
      })
    })
    .catch(error => {
      response.json({
        status: 'fail',
      })
    })
}

//to upload image
function uploadimage(req,res){
  upload(req,res,function(err) {
      if(err) {
          return res.end("Error uploading file.");
      }
      res.json(req.file);
  });

}



function getLocation(req,res){
    dbClient 
    .select()
    .table('location')
    .then(data =>{ //data aauncha
        res.json(data)
    })
    .catch(error => {
        console.log(error);
        res.json({
            status : 'fail',
            data: null,
            error: true
        })
    })
}



function getUsers(req,res){
  dbClient 
  .select()
  .table('users')
  .then(data =>{ //data aauncha
      res.json(data)
  })
  .catch(error => {
      console.log(error);
      res.json({
          status : 'fail',
          data: null,
          error: true
      })
  })
}


function getUserById(req,res){
  const userId = req.params.userId;
  dbClient 
  .select()
  .table('users')
  .where('userId', userId)
  .then(data =>{ //data aauncha
      res.json(data)
  })
  .catch(error => {
      console.log(error);
      res.json({
          status : 'fail',
          data: null,
          error: true
      })
  })
}






// update location 

function updateLocation(request,response){
  const  locationId = request.params.locationId;
  const  name = request.body.name;
  const  latitude = request.body.latitude;
  const  longitude = request.body.longitude;
  

  dbClient
   .table('location')
   .where('id',locationId)
   .update(
     {
       locationName : name,
       latitude : latitude,
       longitude: longitude,
        }
      )
   .then(data => {
    response.json({
      status: 'updated successfully',      
    })
  })
  .catch(error =>{
    console.log(error);
    res.json({
      status:'fail',
      // data:null,
      error:error,
      // error:true
    })
  })  
}


/
function addLocation(request, res) {
  console.log(request.body);
  const locationName = request.body.locationName;
  const latitude = request.body.latitude;
  const longitude  = request.body.longitude ;
      
     dbClient
     .table('location')
     .insert({
       //this must be same for database's column
       locationName: locationName,
       latitude: latitude,
       longitude: longitude
       })
     .then(data => {
       console.log("status is here");
       res.json({
         status: 'success',
         data: {
          data,
         }
       })
     })
     .catch(error => {
       res.json({
         status: 'fail',
       })
     })
 }


 function addBooking(request, res) {
  const tripId = request.body.tripId;
  const email = request.body.email;
  const checkIn  = request.body.checkIn ;
  const checkOut  = request.body.checkOut ;
  const child  = request.body.child ;
  const adult  = request.body.adult ;
  
     dbClient
     .table('book')
     .insert({
       tripId: tripId,
       email: email,
       checkIn: checkIn,
       checkOut: checkOut,
       child: child,
       adult: adult
       })
     .then(data => {
       console.log("status is here");
       res.json({
         status: 'success',
         data: {
          data,
         }
       })
     })
     .catch(error => {
       res.json({
         status: 'fail',
       })
     })
 }






function getTrip(req,res){
  dbClient 
  .select()
  .table('trip')
  .then(data =>{ //data aauncha
      res.json(data)
  })
  .catch(error => {
      console.log(error);
      res.json({
          status : 'fail',
          data: null,
          error: true
      })
  })
}



// to delete trip
function deleteTrip(request,response){

  
  const  tripId = request.params.tripId;
  console.log("tripId" + tripId);
  
  dbClient
   .table('trip')
   .where('tripId',tripId)
   .del()
   .then(data => {
    response.json({
      status: 'deleted successfully',      
    })
  })
  .catch(error =>{
    console.log(error);
    res.json({
      status:'fail',
      data:null,
      error:true
    })
  })  
}



  function deleteLocation(request,response){
    console.log(request.body);
    const  locationId = request.params.locationId;
    
    dbClient
     .table('location')
     .where('id',locationId)
     .del()
     .then(data => {
      response.json({
        status: 'deleted successfully',      
      })
    })
    .catch(error =>{
      console.log(error);
      res.json({
        status:'fail',
        data:null,
        error:true
      })
   })  
}
  


function deleteUser(request,response){
    console.log(request.body);
    const  userId = request.body.userId;
    
    dbClient
     .table('users')
     .where('userId',userId)
     .del()
     .then(data => {
      response.json({
        status: 'success',      
      })
    })
    .catch(error =>{
      console.log(error);
      res.json({
        status:'fail',
        data:null,
        error:true
      })
    })  
}



function updateUser(request,response){
    console.log(request.body);
    const  userId = request.params.storeId;
    const  firstName = request.body.firstName;
    const  lastName= request.body.lastName;
    const  email = request.body.email;
    const  contact = request.body.contact;
    const  password= request.body.password;
    const  userType = request.body.userType;
    const  profileImage = request.body.profileImage;
  
  
    dbClient
     .table('users')
     .where('userid',userId)
     .update(
       {
        firstName	:firstName,
        lastName: lastName,
        email	:email,
        contact: contact,
        password	:password,
        userType	:userType,
        profileImage	:profileImage
}
        )
     .then(data => {
      response.json({
        status: 'updated successfully',      
      })
    })
    .catch(error =>{
      console.log(error);
      response.json({
        status:'fail',
        // data:null,
        error:error,
        // error:true
      })
    })  
  }
  


//for register
express.post('/api/register', registerUser) //repassword front end ma use garne
express.post('/api/auth', authenticate); // 1
express.post('/api/upload', uploadimage);

// express.get('/api/shoes', getShoes);
express.get('/api/users', getUsers);
express.get('/api/users/:userId', getUserById);
express.delete('/api/users/:userId', deleteUser)
express.put('/api/users/:userId', updateUser)


// for book
express.post('/api/book', addBooking); // 1

// for location
express.post('/api/location', addLocation); // 1
express.get('/api/location', getLocation); // 1
express.delete('/api/location/:locationId', deleteLocation)
express.put('/api/location/:locationId', updateLocation)

// for trip
express.get('/api/trip', getTrip);
express.delete('/api/trip/:tripId', deleteTrip)
express.post('/api/trip', addTrip); // 1



express.listen(8005, 'localhost', ()=> {
    console.log("Server is running at", 8005)
})