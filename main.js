(() => {
	/**
	 * @param {string} query
	 * @returns {NodeList | Node} el
	 */
	function select(query) {
		// if ()
		// return document.querySelectorAll()
		if (query.startsWith('#')) {
			return document.querySelector(query);
		} else {
			return document.querySelectorAll(query);
		}
	}

	window.addEventListener('load', () => {
		Date.prototype.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		Date.prototype.getDayString = function () {
			return `${this.days[this.getDay()]}`;
		};

		Date.prototype.getDayMonth = function () {
			// console.log(this.getDayString());
			const day = this.getDate();
			const month = this.getMonth() + 1;

			return `${day}/${month}`;
		};

		/**
		 *
		 * @returns dates
		 */
		function getDays() {
			const dates = [];
			for (let i = 1; i <= 7; i += 1) {
				// date.console.log(date.getDay());
				const base = new Date().valueOf();
				const dateObj = new Date(base + 1000 * 60 * 60 * 24 * i);
				dates.push({ day: dateObj.getDayString(), monthDay: dateObj.getDayMonth() });
				// console.log(base + 60 * 68 * 24 * i);
			}
			return dates;
		}

		const timeline = select('#timeline');
		const dates = getDays();
		dates.forEach((date) => {
			// let li = document.createElement('li');
			// li.innerHTML = date;
			// timeline.appendChild(li);
			let li = `<li>
				${date.day} <br/>
				${date.monthDay}
			</li>`;

			timeline.innerHTML += li;
		});
		new Date().getDayMonth();
	});
})();
