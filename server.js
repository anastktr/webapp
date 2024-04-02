const express = require('express');
const path = require('path');

//xrhsh bibliothikhs uuid
const uuid = require('uuid')

const app = express();
const port = 3000;

//pinakas me statherous xrhstes kai kwdikous
const users = [
  {username: 'user1', password: '12345'} ,
  {username: 'user2', password: '12345'} ,
  {username: 'sofi', password: '12345678'},
  {username: 'thanasakhs', password: '123456'},
  {username: 'user3', password: '12345'} ,
  {username: 'user4', password: '12345'} ,
  {username: 'user5', password: '12345'} ,
  {username: 'user6', password: '12345'} ,
  {username: 'user7', password: '12345'} ,
  {username: 'user8', password: '12345'} 
]

//pinakas gia apothikeush sundedemenwn xrhstvn me sessiodId
let authenticated_users = [
];

//pinakas gia apothikeush agaphmenwn aggeliwn
const favorites = [];

//diadromi gia statika arxeia
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

//diadromi gia ta html arxeia 
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

//diadromh gia thn selida category.html
app.get('/category', (req, res) => {
  res.sendFile(path.join(publicPath, 'category.html'));
});

//diadromh gia thn selida subcategory.html
app.get('/subcategory', (req, res) => {
  res.sendFile(path.join(publicPath, 'subcategory.html'));
});

//diadromh gia thn selida favorite-ads.html
app.get('/favorite-ads', (req, res) => {
  res.sendFile(path.join(publicPath, 'favorite-ads.html'));
});

//to xrhsimopoioume gia ta json aithmata pou dexomaste
app.use(express.json());

//sundesh xrhsth
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    //elegxos an uparxei xrhsths me ta sugkekrimena stoixeia
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      //dhmiourgia monadikou anagnwristikou me to uuid
        const sessionId = uuid.v4();
        const Auser = {
          username: username,
          sessionId: sessionId
        }
        //elegxos an o xrhsths einai hdh sundedemenos
        const authenticated_user = authenticated_users.some(a => a.username === Auser.username)
        if(authenticated_user)
        {
          //an einai prepei na enhmerwsoume ta sessionId
          authenticated_users.forEach(user => {
            if(user.username === Auser.username){
              user.sessionId = Auser.sessionId;
            }
          })

          //enhmerwnoume kai to sessionId stis agaphmenes aggelies
          favorites.forEach(favorite =>{
            if(favorite.u === Auser.username){
              favorite.s = Auser.sessionId
            }
          })
        }else{
          //an den einai ton prosthetoume ston pinaka
          authenticated_users.push(Auser);
        }
        
        res.status(200).json({ success: true, sessionId });
    } else {
      //an den brethei xrhsths epistrefoume sfalma
        res.status(401).send('Μη έγκυρα στοιχεία');
    }
});

//prosthkh aggelieas sta agaphmena
app.post('/addToFavorites', (req,res) =>{

  const { adId, title, description, cost, imageUrl, user, sessionId } = req.body;

  //elegxos an o xrhsths einai sundedemenos apo allo tab
  const not_authenticated_user = authenticated_users.some(a => a.username === user && a.sessionId != sessionId);

  if(not_authenticated_user)
  {
    return res.status(400).json({error: 'Η περίοδος σύνδεσής σας έχει λήξει'})
    //return res.status(400).json({error: 'Η αγγελία είναι ήδη στα αγαπημένα'})
  }

  //elegxos an h aggelia einai hdh sta agaphmena
  const isAlreadyFavorite = favorites.some(favorite => favorite.id === adId && favorite.u === user )

  if(isAlreadyFavorite)
  {
    return res.status(400).json({error: 'Η αγγελία είναι ήδη στα αγαπημένα'})
    //return res.status(400).json({error: 'Η αγγελία είναι ήδη στα αγαπημένα'})
  }

  //dhmiourgia antikeimenou gia thn agaphmenh aggelia
  const favoriteAd = {
    id: adId,
    t: title,
    d: description,
    c: cost,
    i: imageUrl,
    u: user,
    s: sessionId
  };

  //thn prosthetoume ston pinaka
  favorites.push(favoriteAd);

  res.status(200).json({ message: 'Επιτυχής προσθήκη στα αγαπημένα.' });
})




app.get('/favoriteAdsPage', (req,res)=>{
  const username = req.query.username
  const sessionId = req.query.sessionId



  //etsi wste na mporei na kanei tin leitourgia afti mono o pio prosfata sindedemenos xristis
  //px an sindethei o user1 apo ena window
  //kai anoixoume kai allo window kai xanasindethei o user1
  //tha leitourgei mono gia ton user1 pou sindethike pio prosfata diladi tin defteri fora
  const not_authenticated_user = authenticated_users.some(a => a.username === username && a.sessionId != sessionId);

  if(not_authenticated_user){
    return res.status(400).json({error: 'Error'})
  }

  const ads= [];

  favorites.forEach(favorite=>{
    if(favorite.u === username && favorite.s === sessionId ){
      ads.push(favorite)
    }
  })

  res.json(ads);
})

//ekkinisi tou server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});