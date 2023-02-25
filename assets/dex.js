const pokedexLastNumber = 1008;
var saveVersion = 0;
var cardList = [];

createPokemonPageRows();

function convertNumberToString(num) {
  if (num < 1000) {
    return num.toLocaleString("en-US", {
      minimumIntegerDigits: 3,
      useGrouping: false,
    });
  } else {
    return num.toLocaleString("en-US", { useGrouping: false });
  }
}

function createPokemonPage(firstPokemonId, lastPokemonId) {
  const pageDiv = document.createElement("div");
  pageDiv.classList.add("page");

  for (let i = firstPokemonId; i <= lastPokemonId; i++) {
    let pokemonId = convertNumberToString(i);

    const pokemonCardDiv = document.createElement("div");
    pokemonCardDiv.setAttribute("data-pokemon-id", i);

    const pokemonImageDiv = document.createElement("div");
    pokemonImageDiv.classList.add("pokemon-image");

    if (cardList == null || !cardList.length || cardList[i - 1] == null) {
      pokemonCardDiv.classList.add(
        "pokemon-card",
        "col-sm-4",
        "px-1",
        "locked"
      );
    } else {
      let pokemonCard = cardList[i - 1];
      pokemonCardDiv.classList.add("pokemon-card", "col-sm-4", "px-1");

      if (!pokemonCard.unlocked) {
        pokemonCardDiv.classList.add("locked");
      } else {
        pokemonCardDiv.classList.add("unlocked");
      }

      if (pokemonCard.reverseFoil) {
        pokemonCardDiv.classList.add("foil");
      }

      if (pokemonCard.foil) {
        pokemonImageDiv.classList.add("foil");
      }
    }

    const pokemonImage = document.createElement("img");
    pokemonImage.src = `https://www.serebii.net/pokedex-sv/icon/new/${pokemonId}.png`;

    pokemonImageDiv.appendChild(pokemonImage);
    pokemonCardDiv.appendChild(pokemonImageDiv);

    const rowDivs = pageDiv.getElementsByClassName("row");
    const lastRowDiv = rowDivs[rowDivs.length - 1];

    if (!lastRowDiv || lastRowDiv.children.length >= 3) {
      const rowDiv = document.createElement("div");
      rowDiv.classList.add("row", "justify-content-center");
      pageDiv.appendChild(rowDiv);

      rowDiv.appendChild(pokemonCardDiv);
    } else {
      lastRowDiv.appendChild(pokemonCardDiv);
    }
  }

  return pageDiv;
}

function createPokemonPageColumn(firstPokemon, lastPokemon) {
  let pageHeader = document.createElement("div");
  pageHeader.classList.add("page-header");

  let pageTag = document.createElement("span");
  pageTag.classList.add("page-header-tag");
  pageTag.textContent = `${firstPokemon} ~ ${lastPokemon}`;

  const page = document.createElement("div");
  page.classList.add("col-md-6", "mt-4");

  pageHeader.appendChild(pageTag);
  page.appendChild(pageHeader);
  page.appendChild(createPokemonPage(firstPokemon, lastPokemon));
  return page;
}

function createPokemonPageRows() {
  if (!cardList.length) {
    loadCardList();
  }

  var main = document.getElementById("main");
  while (main.firstChild) {
    main.removeChild(main.firstChild);
  }

  const pokemonAmount = pokedexLastNumber;
  let index = 1;

  do {
    const row = document.createElement("div");
    row.classList.add("row");

    let firstPokemon = index;
    let lastPokemon = index + 8;

    if (lastPokemon > pokemonAmount) {
      lastPokemon = pokemonAmount;
    }

    let leftPage = createPokemonPageColumn(firstPokemon, lastPokemon);
    row.appendChild(leftPage);

    if (lastPokemon < pokemonAmount) {
      firstPokemon = lastPokemon + 1;
      lastPokemon = lastPokemon + 9;

      if (lastPokemon > pokemonAmount) {
        lastPokemon = pokemonAmount;
      }

      let rightPage = createPokemonPageColumn(firstPokemon, lastPokemon);
      row.appendChild(rightPage);
    }

    main.appendChild(row);
    index = lastPokemon + 1;
  } while (index < pokemonAmount);
}

const pokemonCards = document.querySelectorAll(".pokemon-card");

pokemonCards.forEach((pokemonCard) => {
  let classIndex = 0;
  const classes = ["locked", "unlocked", "foil"];

  pokemonCard.addEventListener("click", (e) => {
    if (e.target !== pokemonCard) {
      return;
    }

    pokemonCard.classList.remove(classes[classIndex]);
    classIndex = (classIndex + 1) % classes.length;

    const pokemonImage = pokemonCard.firstChild;
    if (pokemonImage.classList.contains("foil") && classIndex == 0) {
      pokemonImage.dispatchEvent(new Event("click"));
    }

    pokemonCard.classList.add(classes[classIndex]);
  });
});

const pokemonImages = document.querySelectorAll(".pokemon-image");

pokemonImages.forEach((pokemonImage) => {
  let classIndex = 0;
  const classes = ["unlocked", "foil"];

  pokemonImage.addEventListener("click", (e) => {
    const pokemonCard = pokemonImage.parentElement;
    if (pokemonCard.classList.contains("locked")) {
      pokemonCard.dispatchEvent(new Event("click"));
      return;
    }

    pokemonImage.classList.remove(classes[classIndex]);
    classIndex = (classIndex + 1) % classes.length;
    pokemonImage.classList.add(classes[classIndex]);
  });
});

function saveCardList() {
  const pageCardList = document.querySelectorAll("[data-pokemon-id]");
  let newCardList = [];

  pageCardList.forEach((card) => {
    let cardImage = card.firstChild;

    let unlocked = !card.classList.contains("locked");
    let foil = cardImage.classList.contains("foil");
    let reverseFoil = card.classList.contains("foil");
    let newCard = {
      id: card.getAttribute("data-pokemon-id"),
      unlocked: unlocked,
      foil: foil,
      reverseFoil: reverseFoil,
    };

    newCardList.push(newCard);
  });

  localStorage.setItem("saveVersion", JSON.stringify(saveVersion));
  localStorage.setItem("cardList", JSON.stringify(newCardList));
}

function loadCardList() {
  saveVersion = JSON.parse(localStorage.getItem("saveVersion"));
  cardList = JSON.parse(localStorage.getItem("cardList"));
}
