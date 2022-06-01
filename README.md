# Vasikan neuvolakortti

## Sovelluksen toiminta

Vasikan neuvolakortti -sovellus on tarkoitettu vasikoiden terveydentilan seurantaan kasvattamoissa. Sovellukseen on tässä vaiheessa toteutettu vasikoiden tunnistaminen, lämpötilan sekä toimenpiteiden kirjaaminen. Sovelluksen etusivulla näytetään listaus vasikoista perustietoineen. Listalta valitsemalla, käyttämällä hakutoimintoa tai skannaamalla vasikan korvamerkin saa esille yksittäisen vasikan tiedot. 

![Vasikoiden listaus](https://github.com/Biodibi/vasikan_neuvolakortti/blob/master/images/vasikan_neuvolakortti_listaus.png)

Asetuksissa voidaan asettaa lämpötilan ala- ja ylärajat, minkä perusteella vasikka voidaan määritellä sairaaksi. Asetuksiin on myös toteutettu tietokannan tyhjennystoiminto testausta varten.

![Asetukset](https://github.com/Biodibi/vasikan_neuvolakortti/blob/master/images/vasikan_neuvolakortti_asetukset.png)

Etusivulla voi valita listauksen sairaista vasikoista seuraavassa näkymässä.

![Asetukset](https://github.com/Biodibi/vasikan_neuvolakortti/blob/master/images/vasikan_neuvolakortti_sairaat.png)

Yksittäisen vasikan tiedot saadaan esille valitsemalla vasikka etusivun listalta, käyttämällä hakutoimintoa tai skannaamalla korvamerkki.  Sovellus kuuntelee myös äänikomentoja eli vasikan tiedot voidaan etsiä ja tietoja syöttää äänikomentojen avulla.

![Vasilan lisäys](https://github.com/Biodibi/vasikan_neuvolakortti/blob/master/images/vasilan_neuvolakortti_lisäys.png)

## Sovelluksen toteutuksessa käytetyt tekniikat

Vasikan neuvolakortti on toteutettu React Nativen versiolla 17 CLI sovelluksena. Lisätietoa tarvittavasta [ympäristöstä](https://reactnative.dev/docs/environment-setup).

Tietokanta on toteutettu käyttämällä [Firebasea](https://firebase.google.com). Sovellusta varten tulee siis luoda tyhjä Realtime database ja konfiguroida tämä sovellus käyttämään sitä editoimalla firebase-kansiossa olevaa Config.js-tiedostoa.

