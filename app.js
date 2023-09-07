const express = require('express');
const app= express();
const Port= process.env.port || 5000;
const mongoose= require('mongoose');
const hbs= require('hbs');
const path= require('path');

// how to connect with the database  (now it will create the pet collection)

mongoose.connect("mongodb://localhost:27017/MissingPetService")
.then(()=>
{
    console.log('connection successful...');
})
.catch((err)=>
{
   console.log(err);
});

// defining the structure or schema of the created collection.it defines the structure of the document.


const document=new mongoose.Schema(
    {
        id:{
         type:String,
         required:true,
         unique:true
        },
        Animal : String,
        Description:String,
        Location:String
    }
);


// mongoose model provides an interface to the database for creating,querying, updating and deleting the queries.
// collection creation

const Document= new mongoose.model('PetCare',document);

// // creating the document 


// how to set the static path which will be used for adding css and js to our website.

const spath= path.join(__dirname,'./public');
app.use(express.static(spath));

// how to set the view path

const tpath = path.join(__dirname,'./templates/views');
app.set('view-engine','hbs');
app.set('views',tpath);

// how to set the partial path

const partialpath= path.join(__dirname,'./templates/partials');
hbs.registerPartials(partialpath);


// for getting the filling form data

app.use(express.json());
app.use(express.urlencoded({extended:false}));
// routing steps

app.get('/',(req,res)=>
{
  res.render('home.hbs');
})

app.get('/missingreport',async (req,res)=>
{
    console.log('hello');
    const result=await Document.find().select({Animal:1,Location:1,_id:0});
   res.render('missingReport.hbs',{name:result});
});
app.post('/addreport',async (req,res)=>
{

const createDocument= async ()=>
{
    try
    {
const CatAnimal=new Document(

    {
        id:req.body.id,
        Animal:req.body.animalname,
        Description:req.body.description,
        Location:req.body.location
    }
);
const result=await CatAnimal.save();
console.log(result);
    }catch(err){
        console.log(err);
        res.render('addreport.hbs',{ form: 'missing form does not filled successfully'});
    }

    res.render('addreport.hbs',{ form: 'missing form filled successfully'});

}

createDocument();
});

app.get('/addreport',(req,res)=>
{
    res.render('addreport.hbs');
})

app.get('*',(req,res)=>
{
    res.render('404Error.hbs');
})


app.listen(Port,(err)=>
{
    console.log(`listening to port number ${Port}`);
})
