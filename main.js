let numSelected = null;
let errors = 0;
let originalBoard = [
    "--74916-5",
    "2---6-3-9",
    "-----7-1-",
    "-586----4",
    "--3----9-",
    "--62--187",
    "9-4-7---2",
    "67-83----",
    "81--45---"
];


let currentBoard = [];

let solution = [
  "387491625",
  "241568379",
  "569327418",
  "758619234",
  "123784596",
  "496253187",
  "934176852",
  "675832941",
  "812945763",
];

window.onload = function () {
  getSudoku();
  setTimeout(setGame, 1000);
};

function setGame() {
  currentBoard = JSON.parse(JSON.stringify(originalBoard)); // Copiar el tablero original al tablero actual

  // Digits 1-9
  for (let i = 1; i <= 9; i++) {
    //<div id="1" class="number">1</div>
    let number = document.createElement("div");
    number.id = i;
    number.innerText = i;
    number.addEventListener("click", selectNumber);
    number.classList.add("number");
    document.getElementById("digits").appendChild(number);
  }

  // Board 9x9
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      let tile = document.createElement("div");
      tile.id = r.toString() + "-" + c.toString();

      if (currentBoard[r][c] != "-") {
        tile.innerText = currentBoard[r][c];
        tile.classList.add("tile-start");
      }

      if (r == 2 || r == 5) {
        tile.classList.add("horizontal-line");
      }

      if (c == 2 || c == 5) {
        tile.classList.add("vertical-line");
      }

      tile.addEventListener("click", selectTile);
      tile.classList.add("tile");
      document.getElementById("board").append(tile);
    }
  }
}

function setBoard(arrayBoard) {
  let tablero = arrayBoard.map((row) => {
    return row
      .map((num) => {
        if (num === 0) {
          return "-";
        } else {
          return num.toString();
        }
      })
      .join("");
  });
  return tablero;
}

const encodeBoard = (board) =>
  board.reduce(
    (result, row, i) =>
      result +
      `%5B${encodeURIComponent(row)}%5D${i === board.length - 1 ? "" : "%2C"}`,
    ""
  );

const encodeParams = (params) =>
  Object.keys(params)
    .map((key) => key + "=" + `%5B${encodeBoard(params[key])}%5D`)
    .join("&");

const getSudoku = () => {
  fetch("https://sugoku.onrender.com/board?difficulty=easy")
    .then((response) => response.json())
    .then((data) => {
      const emptySudoku = data.board;
      originalBoard = setBoard(emptySudoku);

      const solveData = { board: emptySudoku };
      return fetch("https://sugoku.onrender.com/solve", {
        method: "POST",
        body: encodeParams(solveData),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
    })
    .then((response) => response.json())
    .then((data) => {
      const solvedSudoku = data.solution;
      solution = setBoard(solvedSudoku);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

function selectNumber() {
  if (numSelected != null) {
    numSelected.classList.remove("number-selected");
  }
  numSelected = this;
  numSelected.classList.add("number-selected");
}

setTimeout(() => {
  Swal.fire({
    title: "Ingresar tu nombre",
    html: `
    <input type="text" id="nombre" class="swal2-input" placeholder="Nombre del jugador">`,
    confirmButtonText: "Confirmar",
    confirmButtonColor: "rgb(241, 206, 163)",
  }).then((result) => {
    if (result.isConfirmed) {
      let nombre = document.getElementById("nombre").value;
      document.getElementById("nombreJugador").innerText = "Jugador: " + nombre;
    }
  });
}, 1000);


function selectTile() {
  if (numSelected) {
    if (this.innerText != "") {
      return;
    }

    let coords = this.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    if (solution[r][c] == numSelected.id) {
      this.innerText = numSelected.id;
      currentBoard[r] = currentBoard[r].substring(0, c) + numSelected.id + currentBoard[r].substring(c + 1);
      console.log(currentBoard);
      console.log(solution);
      if (currentBoard.join("") == solution.join("")) {
        Swal.fire({
          title: "¡Ganaste!",
          confirmButtonText: "OK",
          text: "Has terminado el sudoku con " + errors + " errores.",
          confirmButtonColor: "rgb(241, 206, 163)",
        });
      }
    } else {
      errors += 1;
      document.getElementById("errors").innerText = errors;
    }
  }
}

const boton = document.getElementById("boton");

