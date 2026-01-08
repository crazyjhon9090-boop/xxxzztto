COMANDO :

firebase init functions


firebase sdk functions para criar users


no final vai ver:
+  Wrote configuration info to firebase.json
+  Wrote project information to .firebaserc

+  Firebase initialization complete!

ai depois deploy só das functions :
firebase deploy --only functions

e pronto ! (y)


LISTAR FUNCTIONS:

firebase functions:list


olhar function:

firebase functions:describe createUser



ADICIONAR UMA CHAVE DA ENV API DE NEWS:

firebase functions:config:set VARIAVEL="SUA_API_KEY"  // modelo antigo
firebase deploy --only functions

 TIRAR CHAVE ENV ERRADA:
firebase functions:config:unset VARIAVEL
firebase functions:secrets:unset GNEWS_API_KEY


setar chave env:

firebase functions:secrets:set GNEWS_API_KEY  // modelo novo


VER LOGS DAS FUNCTIONS : 

firebase functions:log --only api

firebase functions:log


TESTAR DIRETO NO NAVEGADOR:

https://gnews.io/api/v4/top-headlines?lang=pt&country=br&max=1&apikey=SUA_CHAVE_AQUI


https://gnews.io/api/v4/top-headlines?lang=pt&country=br&max=1&apikey=570211608a6d9900550b436e2e80d41f
[ JSON vai retorna as coisas tiver valido ]
