# Jüri Tihane web2 back-end

Käynnistämistä varten aja ensin 'npm install', jonka jälkeen "nodemon"

REST kutsut:  
defaulttina localhost:3000  

index.js  
/json - Palauttaa kaikkien postien JSON:t  
/post - Postaa saapuneen postin DB:hen  
/postComment - Kesken jäänyt toiminta, mutta ideana olisi, että käsittelisi uusia kommentteja  
/user - Routes

user.js
/user/register - Hoitaa rekisteröinnin ja lisää uuden käyttäjän  
/user/login - Hoitaa sisäänkirjautumisen ja tekee tarkistuksia  
/user/me - Keskeneräinen, mutta idean, että palauttaisi käyttäjän tiedot