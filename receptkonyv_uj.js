$(function () {
  const receptTomb = [];
  let novekvo = true;

  adatbeolvas("etelek.json", receptTomb, adatBetolt);

  function adatbeolvas(fajlnev, tomb, myCallback) {
    $.ajax({
      url: fajlnev,
      success: function (result) {
        //console.log(result);
        result.lista.forEach((element) => {
          tomb.push(element); //pakolja be a tombbe a beolvasott json fileban levo lista elemeit
        });
        //console.log(tomb.length);
        //itt teljes a tomb --> itt kell meghivni az adatBetoltest v.egyeb fuggvenyt
        myCallback(tomb);
      },
    });
    //console.log(tomb.length);
    //itt mar ures a tomb
  }

  function adatBetolt() {
    tablazatBetolt();
    sorKiemel();
    navigacio();
    receptMegjelenit();
  }

  function tablazatBetolt() {
    $("article").empty();
    const cim = "<h2>A receptjeink</h2>";
    let receptTablazat = cim + "<div id='recepttablazat'><table>";
    //fejléc kialakitása
    receptTablazat +=
      "<tr id='fejlec'><th>Név</th><th>Elkészítési idő</th><th>Kép</th><th>Leírás</th><th>Hozzávalók</th></tr>";
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
    //console.log(receptTablazat);
    $("article").append(receptTablazat);

    rendez();
  }

  function rendez() {
    $("#kepkontener").empty();
    $("table th").on("click", function () {
      let kulcs;
      if ($(this).html() === "Név") {
        //alfabetikus rendezés --> Név mezőre kattintva
        kulcs = "nev";
        if (novekvo) {
          receptTomb.sort(function (a, b) {
            //logikai függvényt számmá alakítom --> 0-t vagy 1-et kapok; úgy lesz belőle - vagy + szám, ha kivonok belőle 0,5-öt
            return Number(a[kulcs] > b[kulcs]) - 0.5; //poz. esetén lesz csere, neg. esetén nem
          });
        } else {
          receptTomb.sort(function (a, b) {
            return Number(a[kulcs] < b[kulcs]) - 0.5;
          });
        }
      } else if ($(this).html() === "Elkészítési idő") {
        //numerikus rendezés --> Elkészítési idő mezőre kattintva
        kulcs = "elkIdo";
        if (novekvo) {
          receptTomb.sort(
            //növekvő sorrend;
            function (a, b) {
              //a és b objektumokat hasonlítjuk össze
              return (
                a[kulcs].substring(0, a[kulcs].length - 5) -
                b[kulcs].substring(0, b[kulcs].length - 5)
              );
            });
        } else {
          receptTomb.sort(
            //csökkenő sorrend;
            function (a, b) {
              //console.log(a[kulcs]);
              return (
                b[kulcs].substring(0, b[kulcs].length - 5) -
                a[kulcs].substring(0, a[kulcs].length - 5)
              );
            });
        }
      }
      novekvo = !novekvo; //váltson az ellenkező irányba     

      tablazatBetolt();
      sorKiemel();
      receptMegjelenit();
    });
  }

  function navigacio() {
    //jobbra-balra léptetés
    $("#jobb").on("click", function () {
      let kepIndex = $("#kepkontener img").attr("id"); //eltárolom az aktuális kép id-ját
      console.log("akt. kepindex:" + kepIndex);
      if (kepIndex === undefined) {
        kepIndex = -1; //hogy 0-re ugorjon a betöltésnél
      }
      if (kepIndex < 2) {
        kepBetolt(parseInt(kepIndex) + 1); //??? érdekes: csak itt jelzett hibát amiatt, mert kepIndexet stringként értelmezte...
      } else {
        kepBetolt(kepIndex);
      }
    });

    $("#bal").on("click", function () {
      let kepIndex = $("#kepkontener img").attr("id"); //eltárolom az aktuális kép id-ját
      console.log("akt. kepindex:" + kepIndex);
      if (typeof kepIndex === "undefined") {
        kepIndex = 3; //hogy 2-re álljon vissza a betöltésnél
      }
      if (kepIndex > 0) {
        kepBetolt(kepIndex - 1);
      } else {
        kepBetolt(kepIndex);
      }
    });
  }

  function sorKiemel() {
    //egy adott sor fölé húzva a kurzort háttérszínváltás lesz
    $("table tr").on("mouseenter", function () {
      $(this).addClass("sorkiemel");
    });

    $("table tr").on("mouseleave", function () {
      $(this).removeClass("sorkiemel");
    });
  }

  function receptMegjelenit() {
    //a kattintással kiválasztott sorhoz tartozó kép és receptadatok megjelenítése a képkonténerben ill. az alatt
    $("table tr").on("click", function () {
      //a th-t is tr-nek érzékeli, tehát vizsgálnunk kell azt az esetet, amikor a fejlécre kattintunk
      index = $(this).attr("id");
      if ($(this).attr("id") != "fejlec") {
        //ha nem a fejlécre kattintottunk, töltse be a képet
        kepBetolt(index);
      }
    });
  }

  function kepBetolt(index) {
    $("#kepkontener").empty();
    console.log(index);
    //console.log(receptTomb[index].kep);
    let tartalom =
      "<img src='" +
      receptTomb[index].kep +
      "' alt='kep' id='" +
      index +
      "'><h2>" +
      receptTomb[index].nev +
      "</h2><h3>Hozzávalók</h3><ul>";
    //a képnek is legyen a tömbbeli indexe az id-ja
    for (let item in receptTomb[index].hozzavalok) {
      tartalom +=
        "<li>" + item + ": " + receptTomb[index].hozzavalok[item] + "</li>"; //item: kulcs, tomb[item]: kulcshoz tart. érték
    }
    tartalom += "</ul><h3>Leírás</h3>" + receptTomb[index].leiras;
    $("#kepkontener").append(tartalom);
  }
});
