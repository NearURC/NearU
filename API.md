**NearU API**

**Informazioni dei social su un luogo**
----
  Ottenere informazioni ( organizzate in una struttura JSON) di un luogo su facebook e twitter.

* **URL**

  /search/nome/lat/long/&fbt=fbtoken&twt=twtoken&twts=twtokensecret

* **Metodo:**
  

  `GET`
  
*  **Parametri URL**

   **Obbligatori:**
 
   `nome=[String], il nome del luogo da cercare`
   
   `lat=[String], la latitudine del luogo da cercare`
   
   `long=[String], la longitudine del luogo da cercare`
   



   **Obbligatori se si vuole ottenere informazioni sul social corrispondente:**
 
   `fbt=[String], è il token facebook presente nella pagina principale di Near U una volta autenticati con facebook`
   
   `twt=[String], è il token twitter presente nella pagina principale di Near U una volta autenticati con twitter`
   
   `twts=[String], è il secret token di twitter presente nella pagina principale di Near U una volta autenticati con twitter`
   


* **Success Response:**
  
 
  * **Code:** 200 <br />
    **Content:** `{
   "local":{
      "name":[String]
   },
   "facebook":{
      "found":[String],
      "id":[String],
      "tel":[String],
      "img":[String],
      "likes":[String],
      "cooks":[String],
      "titolo":[String],
      "photos":{
         "one":[String],
         "two":[String],
         "three":[String]
      }
   },
   "twitter":{
      "id":[String],
      "name":[String],
      "followers":[String],
      "img":[String],
      "banner":[String],
      "pagesTweets":{
         "one":{
            "id":[String],
            "txt":[String],
            "media":[String]
         },
         "two":{
            "id":[String],
            "txt":[String],
            "media":[String]
         },
         "three":{
            "id":[String],
            "txt":[String],
            "media":[String]
         }
      },
      "tweets":{
         "one":{
            "id":[String],
            "txt":[String]
         },
         "two":{
            "id":[String],
            "txt":[String]
         },
         "three":{
            "id":[String],
            "txt":[String]
         }
      },
      "photos":{
         "one":[String],
         "two":[String],
         "three":[String]
      },
      "geoPhotos":{
         "one":[String],
         "two":[String],
         "three":[String]
      }
   }
}`
* **Sample Call:**

  * **URL:**
`http://nearu-nearu.c9users.io/search/McDonald's Roma Fontana di Trevi/41.9002758/12.481918599999972/&fbt=EAAC06VHccXcBAKqThwgIgG1AeBylW63A9PdLGVUTZClirhewogOC5e9QkiQgkVfgTkQ4i4EYYCPECUJZAC9q7JIJvZCruQ2aqg39gZB8fI1VzECU7VCQGhZBHTrlTeUCIwrZCGLazeXnjJXIfZCAsnbjj9f59STKscZD&twt=168465851-Wem5oMS7xt5CCt8UITcArMZzrzd2xMH3KE6cMie2&twts=nan9O0iB6k6CKQVjtPL4pPsSQkrxlB2KlhLRBZjemf3Sb`
  <br />
  **Risultato**:
  `{
   "local":{
      "name":""
   },
   "facebook":{
      "found":"",
      "id":"867721609976909",
      "tel":"06 69925266",
      "img":"https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/1503974_687422314701492_8531950698015082029_n.png?oh=add165357d844e0c426ae37babbc553b&oe=57FE58A0",
      "likes":17,
      "cooks":"[object Object]",
      "titolo":"McDonald's - Roma Fontana di Trevi",
      "photos":{
         "one":"",
         "two":"",
         "three":""
      }
   },
   "twitter":{
      "id":"71026122",
      "name":"McDonalds",
      "followers":"3233900",
      "img":"http://pbs.twimg.com/profile_images/658746945565954048/Zrf2h3RD_normal.jpg",
      "banner":"https://pbs.twimg.com/profile_banners/71026122/1461689463",
      "pagesTweets":{
         "one":{
            "id":"",
            "txt":"",
            "media":""
         },
         "two":{
            "id":"",
            "txt":"",
            "media":""
         },
         "three":{
            "id":"",
            "txt":"",
            "media":""
         }
      },
      "tweets":{
         "one":{
            "id":"",
            "txt":""
         },
         "two":{
            "id":"",
            "txt":""
         },
         "three":{
            "id":"",
            "txt":""
         }
      },
      "photos":{
         "one":"",
         "two":"",
         "three":""
      },
      "geoPhotos":{
         "one":"",
         "two":"",
         "three":""
      }
   }
}`

 * **URL:**
`http://nearu-nearu.c9users.io/search/mattarello/41.84787439999999/12.45608089999996/&fbt=EAAC06VHccXcBAKqThwgIgG1AeBylW63A9PdLGVUTZClirhewogOC5e9QkiQgkVfgTkQ4i4EYYCPECUJZAC9q7JIJvZCruQ2aqg39gZB8fI1VzECU7VCQGhZBHTrlTeUCIwrZCGLazeXnjJXIfZCAsnbjj9f59STKscZD&twt=168465851-Wem5oMS7xt5CCt8UITcArMZzrzd2xMH3KE6cMie2&twts=nan9O0iB6k6CKQVjtPL4pPsSQkrxlB2KlhLRBZjemf3Sb`
<br />
**Risultato:**
`{ "local":{
  "name":""
  },
  "facebook":{
    "found":"NOTFOUND",
    "id":"88186412304",
    "tel":"06/55283871 06/8554083  06/39726494",
    "desc":"Ristorante cucina tipica romana, Fettuccine fatte a mano, Pizzeria forno a legna, Steakhouse. Prenotazioni: 06/55283871-8554083 - 06/39726494",
    "img":"https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/10392207_10153958486992305_2146700919176320120_n.png?oh=df3ed5fe3191c38dedaf2045d1f72109&oe=57C75B46",
    "likes":6325,
    "cooks":"[object Object]",
    "titolo":"MATTARELLO",
    "photos":{
      "one":"10154184172422305",
      "two":"10154172289137305",
      "three":"10154166869657305"
    }
  },
  "twitter":{
    "id":"1361853812",
    "name":"PastiMattarello",
    "followers":"631",
    "img":"http://pbs.twimg.com/profile_images/665289393662398468/jO87oJhq_normal.png",
    "banner":"https://pbs.twimg.com/profile_banners/1361853812/1450571198",
    "pagesTweets":{
      "one":{
        "id":"",
        "txt":"",
        "media":""
      },
      "two":{
        "id":"",
        txt":"",
        "media":""
      },
      "three":{
        "id":"",
        "txt":"",
        "media":""
      }
    },
    "tweets":{
      "one":{
        "id":"\"741714393235329024\"",
        "txt":"\"@RaiStoria si possono discutere le motivazioni politiche ma dal punto di vista del diritto questo è stata. W D'Alema W Mattarello\""
      },
      "two":{
        "id":"\"741655058593525764\"",
        "txt":"\"Quando ostentate voi stessi io vi guardo dal varco con il mattarello.\""
      },
      "three":{
        "id":"\"741604105249038336\"",
        "txt":"\"#100torri I Veneti del Chierese e la Festa del Ringraziamento: due poesie di Adelino Mattarello https://t.co/ccTwePUYwu\""
      }
    },
    "photos":{
      "one":"http://pbs.twimg.com/media/CklLvAGWgAADm06.jpg",
      "two":"http://pbs.twimg.com/media/CklLvAGWgAADm06.jpg",
      "three":"http://pbs.twimg.com/media/CklLvAGWgAADm06.jpg"
    },
    "geoPhotos":{
      "one":"http://pbs.twimg.com/media/Ckh66x2VAAAk5Sr.jpg",
      "two":"",
      "three":""
    }
  }
}`



**Ottenere l'URL Yelp di un luogo**
----
  Ottenere l'URL della pagina Yelp di un luogo.

* **URL**

  /searchyelp/nome/lat/long


* **Metodo:**
  

  `GET`
  
*  **Parametri URL**

   **Obbligatori:**
 
   `nome=[String], il nome del luogo da cercare`
   
   `lat=[String], la latitudine del luogo da cercare`
   
   `long=[String], la longitudine del luogo da cercare`
   

* **Success Response:**
  
 
  * **Code:** 200 <br />
    **Content:** `[String]`

* **Sample Call:**

  * **URL:**
`http://nearu-nearu.c9users.io/searchyelp/Pasticceria Profumo/41.84787439999999/12.45608089999996`
  <br />
  **Risultato**:
  `"http://www.yelp.com/biz/pasticceria-profumo-roma?utm_campaign=yelp_api&utm_medium=api_v2_search&utm_source=E2f7FVtsG3kP5FeedO00NA"`
  
  
  
  **Disassociare facebook da un account**
----

* **URL**

  /unlink/facebook&id=id&password=password


* **Metodo:**
  
  `DELETE`
  
*  **Parametri URL**

   **Obbligatori:**
 
   `id=[String], è l’id della propria utenza, ottenibile nella parte ‘locale’ delle informazioni utente della pagina principale di Near U`
   
   `password=[String], è la password crittata della propria utenza, ottenibile nella parte ‘locale’ delle informazioni utente della pagina principale di Near U`


* **Success Response:**
  
  * **Code:** 200 <br />
    **Content:** `"deleted"`
    
* **Risposta nel caso facebook fosse già disassociato:**
  
  * **Code:** 200 <br />
    **Content:** `"already not defined"`
    
* **Rrror Response:**
  
 
  * **Code:** 200 <br />
    **Content:** `"error: [stringa di errore]"`
    
* **Risposta nel caso l'utente non sia stato trovato:**
  
 
  * **Code:** 200 <br />
    **Content:** `"not found"`

* **Sample Call:**

  * **URL:**
`http://nearu-nearu.c9users.io/unlink/facebook&id=574d71b3e3a333730df91a58&password=$2a$08$381IrJvxMG0WATNUPcu.GuY.zTtG5QFYGTVMgvU/Rp8UJ2xqUk/p2`
  <br />
  **Risultato**:
  `deleted`
    

 **Disassociare twitter da un account**    
----


* **URL**

  /unlink/twitter&id=id&password=password


* **Metodo:**
  
  `DELETE`
  
*  **Parametri URL**

   **Obbligatori:**
 
   `id=[String], è l’id della propria utenza, ottenibile nella parte ‘locale’ delle informazioni utente della pagina principale di Near U`
   
   `password=[String], è la password crittata della propria utenza, ottenibile nella parte ‘locale’ delle informazioni utente della pagina principale di Near U`


* **Success Response:**
  
  * **Code:** 200 <br />
    **Content:** `"deleted"`
    
* **Risposta nel caso twitter fosse già disassociato:**
  
  * **Code:** 200 <br />
    **Content:** `"already not defined"`
    
* **Rrror Response:**
  
 
  * **Code:** 200 <br />
    **Content:** `"error: [stringa di errore]"`
    
* **Risposta nel caso l'utente non sia stato trovato:**
  
 
  * **Code:** 200 <br />
    **Content:** `"not found"`

* **Sample Call:**

  * **URL:**
`http://nearu-nearu.c9users.io/unlink/twitter&id=574d71b3e3a333730df91a58&password=$2a$08$381IrJvxMG0WATNUPcu.GuY.zTtG5QFYGTVMgvU/Rp8UJ2xqUk/p2`
  <br />
  **Risultato**:
  `deleted`
    
    
    
  **Disassociare google da un account**
----


* **URL**

  /unlink/google&id=id&password=password


* **Metodo:**
  
  `DELETE`
  
*  **Parametri URL**

   **Obbligatori:**
 
   `id=[String], è l’id della propria utenza, ottenibile nella parte ‘locale’ delle informazioni utente della pagina principale di Near U`
   
   `password=[String], è la password crittata della propria utenza, ottenibile nella parte ‘locale’ delle informazioni utente della pagina principale di Near U`


* **Success Response:**
  
  * **Code:** 200 <br />
    **Content:** `"deleted"`
    
* **Risposta nel caso google fosse già disassociato:**
  
  * **Code:** 200 <br />
    **Content:** `"already not defined"`
    
* **Rrror Response:**
  
 
  * **Code:** 200 <br />
    **Content:** `"error: [stringa di errore]"`
    
* **Risposta nel caso l'utente non sia stato trovato:**
  
 
  * **Code:** 200 <br />
    **Content:** `"not found"`

* **Sample Call:**

  * **URL:**
`http://nearu-nearu.c9users.io/unlink/google&id=574d71b3e3a333730df91a58&password=$2a$08$381IrJvxMG0WATNUPcu.GuY.zTtG5QFYGTVMgvU/Rp8UJ2xqUk/p2`
  <br />
  **Risultato**:
  `deleted`
    
