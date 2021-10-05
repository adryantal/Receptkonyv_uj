$(function () {
  const receptTomb = [];

  adatbeolvas("etelek.json", receptTomb, adatbetolt);

  function adatbeolvas(fajlnev, tomb, myCallback) {
    $.ajax({
      url: fajlnev,
      success: function (result) {
        //console.log(result);
        result.lista.forEach((element) => {
          tomb.push(element); //pakolja be a tombbe a beolvasott json fileban levo lista elemeit
        });
        //console.log(tomb.length);
        //itt teljes a tomb --> itt kell meghivni az adatbetoltest v.egyeb fuggvenyt
        myCallback(tomb);
      },
    });
    //console.log(tomb.length);
    //itt mar ures a tomb
  }

  function adatbetolt() {
    let receptTablazat = "<div id='recepttablazat'><table>";
    //fejléc kialakitása
    receptTablazat +=
      "<tr><th>Név</th><th>Elkészítési idő</th><th>Kép</th><th>Leírás</th><th>Hozzávalók</th></tr>";
    var szamlalo = 0;
    receptTomb.forEach((element) => {
      //adatok kigyujtese, rendszerezese
      //let id = element.kep.substring(6, element.kep.length - 4);
      let id = szamlalo; //legyen minden tr id-ja az elem tömbben elfoglalt helye/indexe
      //console.log(id);

      receptTablazat +=
        "<tr id='" +
        id +
        "'><td>" +
        element.nev +
        "</td><td>" +
        element.elkIdo +
        "</td><td>" +
        element.kep +
        "</td><td>" +
        element.leiras +
        "</td><td><ul>";
      for (let item in element.hozzavalok) {
        receptTablazat +=
          "<li>" + item + ": " + element.hozzavalok[item] + "</li>"; //item: kulcs, tomb[item]: kulcshoz tart. érték
      }
      receptTablazat += "</ul></td></tr>";
      szamlalo++;
    });

    receptTablazat += "</table></div>";
    console.log(receptTablazat);
    $("article").append(receptTablazat);

    //kép és adatok megjelenítése a képkonténerben

    $("table tr").on("click", function () {
     
      index = $(this).attr("id");
      kepBetolt(index);
    });

    $("#jobb").on("click", function () {
      let kepIndex = $("#kepkontener img").attr("id"); //eltárolom az aktuális kép id-ját
      if (typeof(kepIndex)==='undefined'){
        kepIndex = -1;   //hogy 0-re ugorjon a betöltésnél
      }
      if ( kepIndex < 2) {
        kepBetolt(parseInt(kepIndex) + 1); //??? érdekes: csak itt jelzett hibát amiatt, mert kepIndexet stringként értelmezte...
      } else {
        kepBetolt(kepIndex);
      }
    });

    $("#bal").on("click", function () {
      let kepIndex = $("#kepkontener img").attr("id"); //eltárolom az aktuális kép id-ját
      if (typeof(kepIndex)==='undefined'){
        kepIndex=3;                                   //hogy 2-re álljon vissza a betöltésnél
      }
      if (kepIndex > 0) {
        kepBetolt(kepIndex - 1);
      } else {
        kepBetolt(kepIndex);
      }
    });
  }

  function kepBetolt(index) {
    $("#kepkontener").empty();
    console.log(index);
    //console.log(receptTomb[index].kep);
    let tartalom = "<img src='"+receptTomb[index].kep+"' alt='kep' id='"+index+"'><h2>" +receptTomb[index].nev+"</h2><h3>Hozzávalók</h3><ul>"; 
    //a képnek is legyen a tömbbeli indexe az id-ja
    for (let item in receptTomb[index].hozzavalok) {
      tartalom +=
        "<li>" + item + ": " + receptTomb[index].hozzavalok[item] + "</li>"; //item: kulcs, tomb[item]: kulcshoz tart. érték
    }
    tartalom += "</ul><h3>Leírás</h3>" + receptTomb[index].leiras;
    $("#kepkontener").append(tartalom);
  }
});
