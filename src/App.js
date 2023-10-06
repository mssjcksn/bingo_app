import "./App.css";
import React, { useState } from "react";
import { Container, Button, TextField } from "@mui/material";
import axios from "axios";

function App() {
  const [gameCode, setGameCode] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [bingoCard, setBingoCard] = useState(null);
  const [clickedNumbers, setClickedNumbers] = useState([]);

  function enterGame() {
    axios
      .get(
        `http://www.hyeumine.com/getcard.php?bcode=${gameCode}`,
        {},
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => {
        if (response.data === 0) {
          alert("Invalid game code!");
          setGameCode("");
        } else {
          setIsValid(true);
          setBingoCard(response.data);
        }
      })
      .catch((error) => {
        console.error("There was a problem: ", error);
      });
  }

  function changeCode() {
    const newCode = prompt("Enter new game code: ");
    axios
      .get(
        `http://www.hyeumine.com/getcard.php?bcode=${newCode}`,
        {},
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => {
        if (response.data === 0) {
          alert("Invalid game code!");
        } else {
          setGameCode(newCode);
          setBingoCard(response.data);
          setClickedNumbers({});
        }
      })
      .catch((error) => {
        console.error("There was a problem: ", error);
      });
  }

  function checkWin() {
    axios
      .get(
        `http://www.hyeumine.com/checkwin.php?playcard_token=${bingoCard.playcard_token}`,
        {},
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => {
        if (response.data === 0) {
          alert("You lost! :(");
        } else {
          alert("BINGO!");
        }
      })
      .catch((error) => {
        console.error("There was a problem: ", error);
      });
  }

  function getNewToken() {
    axios
      .get(
        `http://www.hyeumine.com/getcard.php?bcode=${gameCode}`,
        {},
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => {
        setClickedNumbers({});
        setBingoCard(response.data);
      })
      .catch((error) => {
        console.error("There was a problem: ", error);
      });
  }

  const clickNumber = (letter, number) => {
    const updateNumbers = { ...clickedNumbers };

    if (updateNumbers[letter] && updateNumbers[letter].includes(number)) {
      updateNumbers[letter] = updateNumbers[letter].filter((n) => n !== number);
    } else {
      updateNumbers[letter] = updateNumbers[letter]
        ? [...updateNumbers[letter], number]
        : [number];
    }

    setClickedNumbers(updateNumbers);
  };

  return (
    <>
      <Container
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        {isValid ? (
          <div className="center-content">
            <h2 style={{ color: "white", marginBottom: "1px" }}>
              Game Code: {gameCode}
            </h2>
            <p style={{ color: "white" }}>
              Playcard Token: {bingoCard.playcard_token}
            </p>

            <div className="change-open">
              <Button
                variant="text"
                style={{
                  color: "white",
                  textTransform: "none",
                  textAlign: "left",
                }}
                onClick={() => changeCode()}
              >
                &lt;&lt; Change game code
              </Button>
              <Button
                variant="text"
                style={{ color: "white", textTransform: "none" }}
                href={`http://www.hyeumine.com/bingodashboard.php?bcode=${gameCode}`}
                target="_blank"
              >
                Open dashboard &gt;&gt;
              </Button>
            </div>

            <div className="bingo-box">
              <div className="column">
                {Object.keys(bingoCard.card).map((letter, index) => (
                  <div key={index} className="letter-column">
                    <h1>{letter}</h1>
                    <div className="number-column">
                      {bingoCard.card[letter].map((number, index) => (
                        <div
                          key={index}
                          className={`number-box ${
                            clickedNumbers[letter]?.includes(number)
                              ? "clicked"
                              : ""
                          }`}
                          onClick={() => clickNumber(letter, number)}
                        >
                          {number}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bingo-buttons">
              <Button
                variant="contained"
                style={{ marginRight: "10px", fontWeight: "bold" }}
                onClick={() => checkWin()}
              >
                Check Card
              </Button>
              <Button
                variant="contained"
                style={{ fontWeight: "bold" }}
                onClick={() => getNewToken()}
              >
                New Card
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="center-content">
              <TextField
                id="filled-basic"
                label="Enter game code here"
                variant="filled"
                style={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  width: "30em",
                  marginBottom: "10px",
                }}
                onChange={(e) => {
                  setGameCode(e.target.value);
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  enterGame();
                }}
              >
                Confirm
              </Button>
            </div>
          </>
        )}
      </Container>
    </>
  );
}

export default App;
