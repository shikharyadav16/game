      function closeLobbyButtons() {
            document.getElementsByClassName("game")[0].classList.remove("active-game")
            document.getElementsByClassName("my-game")[0].classList.remove("active-game")
        }

        document.getElementsByClassName("my-game")[0].addEventListener("click", (e) => {
            e.preventDefault();
            closeLobbyButtons();
            document.getElementsByClassName("my-game")[0].classList.add("active-game");
            const teamSize = findTeamSize()
            handleTeamClick(teamSize, "mygames")
        })
        document.getElementsByClassName("game")[0].addEventListener("click", (e) => {
            e.preventDefault();
            closeLobbyButtons();
            document.getElementsByClassName("game")[0].classList.add("active-game");
            const teamSize = findTeamSize()
            handleTeamClick(teamSize, "games")
        });

        function findLobby() {
            const games = document.getElementsByClassName("game")[0];
            const myGames = document.getElementsByClassName("my-game")[0];

            if (games.classList.contains("active-game")) {
                return "games";
            } else {
                return "mygames"
            }
        }
        function findTeamSize() {
            const solo = document.getElementsByClassName("solo")[0];
            const duo = document.getElementsByClassName("duo")[0];
            const squad = document.getElementsByClassName("squad")[0];

            if (solo.classList.contains("filter-team-active")) {
                return "solo";
            } else if (duo.classList.contains("filter-team-active")) {
                return "duo";
            } else {
                return "squad";
            }
        }

        document.getElementsByClassName("solo")[0].addEventListener("click", (e) => {
            e.preventDefault();
            closeAllButtons();
            onClickedButton("solo");
            const lobby = findLobby()
            handleTeamClick("solo", lobby);
        });
        document.getElementsByClassName("duo")[0].addEventListener("click", (e) => {
            e.preventDefault();
            closeAllButtons();
            onClickedButton("duo");
            const lobby = findLobby()
            handleTeamClick("duo", lobby);
        });
        document.getElementsByClassName("squad")[0].addEventListener("click", (e) => {
            e.preventDefault();
            closeAllButtons();
            onClickedButton("squad");
            const lobby = findLobby()
            handleTeamClick("squad", lobby);
        });

        function closeAllButtons() {
            document.getElementsByClassName("solo")[0].classList.remove("filter-team-active");
            document.getElementsByClassName("duo")[0].classList.remove("filter-team-active");
            document.getElementsByClassName("squad")[0].classList.remove("filter-team-active");
        }
        function onClickedButton(btn) {
            document.getElementsByClassName(btn)[0].classList.add("filter-team-active");
        }

        async function handleTeamClick(teamSize, lobby) {
            const userEmail = "yadavshikhar49@gmail.com"
            const gameType = "bgmi";

            try {
                const response = await fetch(`/${lobby}/${gameType}/${teamSize}`, {
                    method: "POST",
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userEmail })
                });
                const data = await response.json();

                if (response.ok) {
                    const container = document.getElementsByClassName('room-container')[0];
                    container.innerHTML = '';

                    if (data.games.length === 0) {
                        document.getElementsByClassName("room-container")[0].innerHTML = `<img src="/assets/empty_img.png" id="empty-img" alt="">`
                    }

                    if (lobby === "games") {
                        data.games.forEach((game) => {
                            createGameCard(game);
                        });
                    } else {
                        data.games.forEach((game) => {
                            createMyGameCard(game);
                        });
                    }

                } else {
                    window.location.href = data.redirect;
                }
            } catch (err) {
                console.error("Error fetching games:", err);
            }
        }

        function createGameCard(game) {
            const container = document.getElementsByClassName("room-container")[0];
            const playersJoined = game.eventArray.length;
            const formattedTime = game.eventTime;
            const isClosed = playersJoined >= game.eventSize;

            const card = document.createElement("div");
            card.classList.add("room-card");

            card.innerHTML = `
        <div class="card-img">
            <img src="/assets/games/${game.eventColor}.jpg" alt="" class="${game.eventColor}">
        </div>
        <div class="room-details">
            <img src="/assets/${game.eventType}.png" alt="err">
            <div class="room-info">
                <div class="room-time similar-room-info">
                    <div class="card-heading">Time:</div>
                    <div class="card-value">${formattedTime} (${game.eventDate})</div>
                </div>
                <hr>
                <div class="room-players similar-room-info">
                    <div class="card-heading">Players:</div>
                    <div class="card-value">${playersJoined} / ${game.eventSize}</div>
                </div>
                <hr>
                <div class="prize">
                    <div class="card-heading">Prize:</div>
                    <div class="kill-prize">
                        <div class="prize-heading">Kill Prize:</div>
                        <div class="prize-value">₹${game.eventKillPrize} / kill</div>
                    </div>
                    <div class="pos-prize">
                        <div class="prize-heading">Position Prize:</div>
                        <div class="prize-value">₹${game.eventPosPrize}</div>
                    </div>
                </div>
                <hr>
                <div class="entry-fee similar-room-info">
                    <div class="card-heading">Entry fee:</div>
                    <div class="card-value">₹${game.eventEntry}</div>
                </div>
            </div>
        </div>
        <div data-id="${game.eventId}" class="register-btn ${isClosed ? "btn-closed" : "register"} card-btn">
            ${isClosed ? "Closed" : "Register"}
        </div>
        <div class="details-btn card-btn">Details</div>
    `;

            container.appendChild(card);
        }

        function createMyGameCard(game) {
    const container = document.getElementsByClassName("room-container")[0];
    const playersJoined = game.eventArray.length;
    const formattedTime = game.eventTime;
    const targetDate = new Date(`${game.eventDate}T${game.eventTime}:00`);

    const card = document.createElement("div");
    card.classList.add("room-card");

    card.innerHTML = `
        <div class="card-img">
            <img src="/assets/games/${game.eventColor}.jpg" alt="" class="${game.eventColor}">
        </div>
        <div class="room-details">
            <img src="/assets/${game.eventType}.png" alt="err">
            <div class="room-info">
                <div class="room-time similar-room-info">
                    <div class="card-heading">Time:</div>
                    <div class="card-value">${formattedTime} (${game.eventDate})</div>
                </div>
                <hr>
                <div class="room-players similar-room-info">
                    <div class="card-heading">Players:</div>
                    <div class="card-value">${playersJoined} / ${game.eventSize}</div>
                </div>
                <hr>
                <div class="prize">
                    <div class="card-heading">Prize:</div>
                    <div class="kill-prize">
                        <div class="prize-heading">Kill Prize:</div>
                        <div class="prize-value">₹${game.eventKillPrize} / kill</div>
                    </div>
                    <div class="pos-prize">
                        <div class="prize-heading">Position Prize:</div>
                        <div class="prize-value">₹${game.eventPosPrize}</div>
                    </div>
                </div>
                <hr>
                <div class="entry-fee similar-room-info">
                    <div class="card-heading">Entry fee:</div>
                    <div class="card-value">₹${game.eventEntry}</div>
                </div>
            </div>
        </div>
        <div class="idp-btn card-btn timer-btn" data-id="${game.eventId}">Loading...</div>
        <div class="details-btn card-btn">Details</div>
    `;

    container.appendChild(card);

    const timerElement = card.querySelector('.timer-btn');
    startTimer(timerElement, targetDate);
}

function startTimer(element, target) {
    function update() {
        const now = new Date();
        const diff = target - now;

        if (diff <= 0) {
            element.textContent = "Started";
            element.classList.remove("idp-timer-btn");
            element.classList.add("idp-btn");
            clearInterval(timerId);
            return;
        }

        const totalSeconds = Math.floor(diff / 1000);
        const days = Math.floor(totalSeconds / (3600 * 24));
        const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        element.textContent = `${days}D ${hours}H ${minutes}M ${seconds}S`;
    }

    update(); // Initial call
    const timerId = setInterval(update, 1000);
}
