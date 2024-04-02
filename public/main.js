//orizoume metablhtes gia thn sundesh tou xrhsth
let active_user= false;
let sessionId ;
let user;

//ekteleitai efoson ginei load to dom
document.addEventListener("DOMContentLoaded", function () {

    //lhpsh parametrwn url
    const urlParams = new URLSearchParams(window.location.search);

    if(urlParams.size === 0)
    {
        try {

            //anaktoume ta dedomena apo to link
            fetch('https://wiki-ads.onrender.com/categories')
                .then(response => response.json())
                .then(categories => {
                    const source = document.getElementById('categories-template').innerHTML;
                    const template = Handlebars.compile(source);
    
                    const renderCategory = (category) => {
                        fetchSubcategories(category.id)
                            .then(subcategoriesResponse => subcategoriesResponse.json())
                            .then(subcategories => {
                                category.img_url = 'https://wiki-ads.onrender.com/' + category.img_url
                                const html = template({ categories: [{ ...category, subcategories }] });
                                document.getElementById('categories-container').innerHTML += html;
                            })
                            .catch(error => console.error('Error fetching subcategories:', error));
                    };
    
                    Promise.all(categories.map(renderCategory));
                })
                .catch(error => console.error('Error fetching data:', error));
        } catch (error) {
            console.error('Error in DOMContentLoaded event:', error);
        }
    }
    
});

function fetchSubcategories(categoryId) {
    return fetch('https://wiki-ads.onrender.com/categories/' + categoryId + '/subcategories');
}



document.addEventListener("DOMContentLoaded", function () {
    
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('id');

    //elegxos an den uparxei categoryId
    if (!categoryId) {
        
        return;
    }

    
    fetchCategoryAds(categoryId)
        .then(ads => {

            var source = document.getElementById('category-ads-template').innerHTML;

            //diamorfwnoume to link sto opoio uparxei h eikona/eikones
            if (ads && ads.length > 0) {
                ads.forEach(ad => {
                    if (ad.images && ad.images.length > 0) {
                        ad.images = ad.images.map(image => 'https://wiki-ads.onrender.com/' + image);
                    } else {
                        console.error('Ad images are missing or undefined.');
                    }
                });
            } else {
                console.error('Either ads or ads[0].images is undefined.');
            }

            
            ads.forEach(ad =>{
                if (ad.description) {
                    ad.description = ad.description.replace('\"', ' inches');
                    ad.description = ad.description.replace("/'", '/');
                    ad.description = ad.description.replace("/'", '/');
                    ad.description = ad.description.replace("'", '/');
                } else {
                    console.error('Ad description is missing or undefined.');
                    ad.description = 'No description available'; 
                }
            })

            //prosthetoume ta dedomena sthn html mesw twn handlebars
            var template = Handlebars.compile(source);

            
            var html = template({ ads });

            



            //emfanish html
            document.getElementById('category-ads-container').innerHTML = html;
        })
        .catch(error => {
            console.error('Error fetching category ads:', error);
        });
})

function fetchCategoryAds(categoryId) {
    return fetch(`https://wiki-ads.onrender.com/ads?category=${categoryId}`)
        .then(response => response.json());
}


document.addEventListener("DOMContentLoaded", function () {
    
    const urlParams = new URLSearchParams(window.location.search);
    const subcategoryId = urlParams.get('id');

    //elegxos an den uparxei subcategoryId
    if (!subcategoryId) {
        
        return;
    }

    
    
    fetchSubcategoryAds(subcategoryId)
        .then(ads => {
            var source = document.getElementById('subcategory-ad-template').innerHTML;
            var template = Handlebars.compile(source);

            //diamorfwnoume to link sto opoio uparxei h eikona/eikones
            if (ads && ads.length > 0) {
                ads.forEach(ad => {
                    if (ad.images && ad.images.length > 0) {
                        ad.images = ad.images.map(image => 'https://wiki-ads.onrender.com/' + image);
                    } else {
                        console.error('Ad images are missing or undefined.');
                    }
                });
            }

            
            //sthn sugkekrimenh if diamorfwnoume ta dedomena pou pairnoume apo to link wste na ftiaksoume to antistoixo table sthn html
            if (ads && ads.length > 0) {
                ads.forEach(ad => {
                    if (ad.features && ad.features.length > 0) {
                        var featuresArray = ad.features.split('; ');

                        var featuresArray2 = [];

                        featuresArray.forEach(feature =>{
                            var featureObj = feature.split(': ')
                            featuresArray2.push(featureObj)

                        })

                        ad.features = featuresArray2 
                    }
                });
            }

            
            var html = template({ ads });

            
            document.getElementById('subcategory-ads-container').innerHTML = html;
        })
        .catch(error => {
            console.error('Error fetching subcategory ads:', error);
        });
});

function fetchSubcategoryAds(subcategoryId) {
    return fetch(`https://wiki-ads.onrender.com/ads?subcategory=${subcategoryId}`)
        .then(response => response.json())
}


//sundesh tou xrhsth
function login(){
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    user = username;


    //ta dedomena gia to aithma sundeshs
    const data = {
        username: username,
        password: password
    };


    //oi ruthmiseis tou aithmatos
    const init = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    //apostolh tou aithmatos
    fetch('/login', init)
        .then(response => {
            if (!response.ok) {
                throw new Error('Σφάλμα στην σύνδεση');
            }
            return response.json();
        })
        .then(data => {
            console.log('Επιτυχής Σύνδεση: ', data);
            sessionId = data.sessionId;

            document.getElementById('login-form-container').style.display = "none";

            document.getElementById('success-message').style.display = 'block';

            //orismos ths katastashs xrhsth ws energh
            active_user = true;

            //dhmiourgia sundesmou gia tis agaphmenes aggelies
            const favoriteAdsLink = document.getElementById('favoriteAdsLink');
            favoriteAdsLink.href = `favorite-ads.html?username=${user}&sessionId=${sessionId}`;
        })
        .catch(error => {
            console.error('Σφάλμα στην σύνδεση: ', error.message);
            alert('Λανθασμένα στοιχεία σύνδεσης. Παρακαλώ προσπαθήστε ξανά.');
        });
}

//elegxos katastashs xrhsth
function isLoggedIn(){
    return active_user;
}

//prosthikh aggelieas sta agaphmena 
function addToFavorites(adId, title, cost, imageUrl, description) {
    try {
        console.log('Μπήκε');
        if (isLoggedIn()) {
            callAddToFavorites(adId, title, cost, imageUrl, description);
        } else {
            alert('Παρακαλώ συνδεθείτε για προσθήκη στη λίστα αγαπημένων.');
        }
    } catch (error) {
        console.error("Error in addToFavorites:", error);
    }
}


function callAddToFavorites(adId, title, cost, imageUrl, description) {
    //ta dedomena gia to aithma sundeshs
    const data = {
        adId,
        title,
        cost,
        imageUrl,
        description,
        user,
        sessionId
    };

    //oi ruthmiseis tou aithmatos
    const init ={
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    //apostolh tou aithmatos
    fetch('/addToFavorites', init)
        .then(response => {
            if(!response.ok){
                
                return response.json().then(error => {
                    
                    console.log(error.error)
                    throw new Error(error.error)})
                //throw new Error(response.json());
                
                //throw new Error('Σφάλμα κατά την προσθήκη στα αγαπημένα');
            }
            return response.json();
        })
        .then(result =>{
            console.log('Επιτυχής προσθήκη στα αγαπημένα: ',result);

            //emfanizetai mhnuma oti h aggelia prostethike sta agaphmena to opoio eksafanizetai meta apo ligo
            const addToFavoritesMessage = document.getElementById('add-to-favorites-message');
            addToFavoritesMessage.textContent = 'Η αγγελία προστέθηκε στα αγαπημένα!';
            addToFavoritesMessage.style.display = 'block';
            setTimeout(() => {
                addToFavoritesMessage.style.display = 'none';
            }, 3000);
        })
        .catch(error =>{
            
            //Emfanish mhnumatos gia an uparxei hdh h aggelia sta agaphmena
            console.error('Σφάλμα κατά την προσθήκη στα αγαπημένα: ', error.message);
            const AlreadyFavorite = document.getElementById('already-to-favorites-message');
            AlreadyFavorite.textContent = error;
            AlreadyFavorite.style.display = 'block';
            setTimeout(() => {
                AlreadyFavorite.style.display = 'none';
            }, 3000);
            
        })
}

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    const sessionId = urlParams.get('sessionId');

    
    //apostolh tou aithmatos
    fetch(`/favoriteAdsPage?username=${username}&sessionId=${sessionId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Σφάλμα κατά φόρτωση της σελίδας');
            }
            return response.json();
        })
        .then(result => {
            console.log('Επιτυχής φόρτωση της σελίδας: ', result);

            //emfanish agaphmenwn aggeliwn me xrhsh twn handlebars
            const source = document.getElementById('favorite-ads-template').innerHTML;

            
            const template = Handlebars.compile(source);

            
            const html = template({ ad: result });

            
            document.getElementById('favorite-ads-container').innerHTML = html;
        })
        .catch(error => {
            console.error('Σφάλμα κατά φόρτωση της σελίδας: ', error.message);
        });
});
    
