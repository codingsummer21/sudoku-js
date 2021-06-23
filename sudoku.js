
// This is the original puzzle and remains intact
var sudoku = {}
// This is the puzzle to be updated with player choices
var puzzlePlaying = ''
// The value of the selected button
var selectedValue = 0

function getPuzzle() {
    fetch('http://localhost/cs21/sudoku.back/api/v1/get_sudoku.php')
        .then(response => response.json())
        .then(data => {
            sudoku = data
            puzzlePlaying = data['puzzle']
            console.log(puzzlePlaying)
            displayPuzzle()
            displayButtons()
            document.getElementById("result").innerHTML = "&nbsp;"
        })
}

function displayPuzzle() {
    let puzzle = sudoku['puzzle']
    let tbl = '<tr>'
    for(let i = 0; i < puzzle.length; i++) {
        if(i % 9 == 0 && i > 0) {
            tbl += '</tr><tr>'
        }
        let ch = puzzle.charAt(i);
        let chPlaying = puzzlePlaying.charAt(i)
        if(chPlaying == 0) {
            tbl += '<td onclick="tdClicked(this.id)"  id="td' + i + '">&nbsp;</td>'
        }
        else if(ch == 0) {
            tbl += '<td id="td' + i + '">' + ch + '</td>'
        }
        else {
            tbl += '<td class="initial-value">' + ch + '</td>'
        }
    }
    tbl += '</tr>'
    document.getElementById("sudoku-table").innerHTML = tbl
}

function displayButtons() {
    let btns = ''
    for(let i = 1; i <= 9; i++) {
        btns += "<button onClick=selectButton(" +
            i + ") id='b" + i + "'>" + i + "</button> "
    }

    document.getElementById("selection-buttons").innerHTML = btns

    for(let i = 1; i <= 9; i++) {
        let btn = document.getElementById("b"+i)
        btn.classList.add("unselected-button")
    }
}

function selectButton(value) {
    for(let i = 1; i <= 9; i++) {
        // Deselect the previously selected button
        if(selectedValue != 0) {
            let btn = document.getElementById("b"+selectedValue)
            btn.classList.remove("selected-button")
            btn.classList.add("unselected-button")
        }
        selectedValue = value
        let btn = document.getElementById("b"+selectedValue)
        btn.classList.remove("unselected-button")
        btn.classList.add("selected-button")
    }
}

function tdClicked(id) {
    if(selectedValue > 0) {
        document.getElementById(id).innerHTML = selectedValue
        let pos = id.substring(2)
        let index = parseInt(pos)
        puzzlePlaying = puzzlePlaying.substring(0, index) + selectedValue + puzzlePlaying.substring(index + 1);
        if(!puzzlePlaying.includes("0")) {
            fetch('http://localhost/cs21/sudoku.back/api/v1/solved.php', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({id: sudoku.id, solution: puzzlePlaying})
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    if(data.result == true) {
                        document.getElementById("result").innerHTML = "<h2>Completed!</h2>"
                    }
                    else {
                        document.getElementById("result").innerHTML = "<h2>Wrong ...</h2>"
                    }
                })
                .catch(error => console.log(error))
        }
    }
}

