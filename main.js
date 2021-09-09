(() => {
  const opWTHRKEY = "85e7481d8cfba840c714f532c6a2f18f";
  const localstore = "forecast";
  /**
   * @param {string} query
   * @returns {NodeList} el
   */
  function select(query) {
    return document.querySelectorAll(query);
  }
  /**
   * @param {string} evt
   * @param {Node} el
   * @param {Function} handler
   */
  function on(evt, el, handler) {
    el.addEventListener(evt, handler);
  }

  /**
   * @name getDayString
   * @function
   * @returns {string} day
   */
  Date.prototype.getDayString = function () {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[this.getDay()];
  };

  Date.prototype.getDateString = function () {
    return `${this.getDate()}/${this.getMonth() + 1}`;
  };

  String.prototype.capitalize = function () {
    let str = this;
    str = str.split("");
    str[0] = str[0].toUpperCase();
    str = str.join("");
    return str;
  };
  const display = select("#info-display")[0];
  const getLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position);
        },
        (err) => {
          reject(err);
        }
      );
    });
  };

  const getWeather = async (position) => {
    const { coords } = await getLocation();
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${opWTHRKEY}&units=metric`
      );

      const data = await res.json();
      return data;
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  const getForeCast = async () => {
    const { coords } = await getLocation();
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?appid=${opWTHRKEY}&lat=${coords.latitude}&lon=${coords.longitude}&exclude=current,minutely,hourly,alerts&units=metric`
      );
      return await res.json();
    } catch (err) {
      return err;
    }
  };

  const loadPage = async () => {
    const timeline = select("#timeline")[0];
    const base = new Date().valueOf();

    const forecast = await getForeCast();

    for (let i = 0; i <= 7; i += 1) {
      let date = new Date(base + 1000 * 60 * 60 * 24 * i);
      let li = document.createElement("li");
      li.innerHTML = `
				<span>
					${date.getDayString()}
				</span>
				<span>
					${date.getDateString()}
				</span>	
			`;
      li.setAttribute("data-date", date.getDateString());
      li.addEventListener("click", async function () {
        const date_string = this.getAttribute("data-date");
        forecast.daily.forEach((date, index) => {
          let { dt } = date;
          dt *= 1000;
          const dateStr = new Date(dt).getDateString();
          if (date_string === dateStr) {
            const data = forecast.daily[index];
            const text = `
							<div class='weather-info'>
								<img src="https://openweathermap.org/img/w/${
                  data.weather[0].icon
                }.png" title="${data.weather[0].main}" />
								<p class='text-large'>${data.weather[0].description.capitalize()}</p>
								<p class="text-large">${new Date(data.dt * 1000).toDateString()}</p>

								<table class='text-large'>
									<tr>
										<td>Day:</td>
										<td>${data.temp.day}&deg;C</td>
										<td>Feels Like:</td>
										<td>${data.feels_like.day}&deg;C</td>
									</tr>
									<tr>
										<td>Evening:</td>
										<td>${data.temp.eve}&deg;C</td>
										<td>Feels Like:</td>
										<td>${data.feels_like.eve}&deg;C</td>
									</tr>
									<tr>
										<td>Max Temperature:</td>
										<td>${data.temp.max}&deg;C</td>
									</tr>
									<tr>
										<td>Min Temperature:</td>
										<td>${data.temp.min}&deg;C</td>
									</tr>
								</table>
							</div>
						`;
            display.innerHTML = text;
          }
        });
      });
      timeline.appendChild(li);
    }

    forecast["daily"].forEach((date, index) => {
      let { dt } = date;
      dt *= 1000;
      const dateStr = new Date(dt).getDateString();
      const elem = timeline.querySelectorAll("li")[index];
      if (elem.getAttribute("data-date") === dateStr) {
        const iconUrl = `https://openweathermap.org/img/w/${date.weather[0].icon}.png`;
        elem.style.backgroundImage = `url(${iconUrl})`;
      }
    });
  };

  window.addEventListener("load", () => {
    loadPage();
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("sw.js")
        .then((sw) => {
          console.log(`Service worker registered ${sw.scope}`);
        })
        .catch((err) => console.error);
    }
  });

  window.addEventListener("beforeinstallprompt", handleInstall);
})();

/**
 *
 * @param {Event} e
 */
async function handleInstall(e) {
  let deferredPrompt;
  e.preventDefault();
  deferredPrompt = e;

  try {
    let button = document.querySelector("main > div > button.btn.btn-dark"); // || document.createElement('button');

    button.addEventListener("click", async (evt) => {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(outcome);
      if (outcome === "accepted") {
        deferredPrompt = null;
      }
      if (outcome === "dismissed") {
        document
          .getElementsByTagName("main")[0]
          .querySelector("div.container")
          .removeChild(button);
      }
    });
  } catch (err) {}
}
