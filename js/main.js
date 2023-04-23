jQuery(document).ready(function ($) {
	// check if we need show more button
	$showMore = $(".main__show-more");

	$($showMore).each(function () {
		if ($(this).prev().prop("scrollHeight") > 48) {
			$(this).addClass("active");
		} else {
			$(this).removeClass("active");
		}
	});

	// show more button
	$(".main__show-more").on("click", function (e) {
		e.preventDefault();
		var $this = $(this);
		var $content = $this.prev();
		var linkText = $this.text().toUpperCase().trim();

		if (linkText === "SHOW MORE...") {
			linkText = "Show less";
			$content.addClass("active");
		} else {
			linkText = "Show more...";
			$content.removeClass("active");
		}

		$this.text(linkText);
	});

	// select-language
	$(".select").each(function () {
		const _this = $(this),
			selectOption = _this.find("option"),
			selectOptionLength = selectOption.length,
			selectedOption = selectOption.filter(":selected"),
			duration = 450;

		_this.hide();
		_this.wrap('<div class="select"></div>');
		$("<div>", {
			class: "new-select",
			text: _this.children("option:disabled").text(),
		}).insertAfter(_this);

		const selectHead = _this.next(".new-select");
		$("<div>", {
			class: "new-select__list",
		}).insertAfter(selectHead);

		const selectList = selectHead.next(".new-select__list");
		for (let i = 1; i < selectOptionLength; i++) {
			$("<div>", {
				class: "new-select__item",
				html: $("<span>", {
					text: selectOption.eq(i).text(),
				}),
			})
				.attr("data-value", selectOption.eq(i).val())
				.appendTo(selectList);
		}

		const selectItem = selectList.find(".new-select__item");
		selectList.slideUp(0);
		selectHead.on("click", function () {
			if (!$(this).hasClass("on")) {
				$(this).addClass("on");
				selectList.slideDown(duration);

				selectItem.on("click", function () {
					let chooseItem = $(this).data("value");

					$("select").val(chooseItem).attr("selected", "selected");
					selectHead.text($(this).find("span").text());

					selectList.slideUp(duration);
					selectHead.removeClass("on");
				});
			} else {
				$(this).removeClass("on");
				selectList.slideUp(duration);
			}
		});
	});
});

// infinite pagination
const quotesEl = document.querySelector(".main__wrapper");
const loaderEl = document.querySelector(".loader");

// get the quotes from API
const getQuotes = async (page, limit) => {
	// const API_URL = `https://api.javascripttutorial.net/v1/quotes/?page=${page}&limit=${limit}`;
	const API_URL = `https://picsum.photos/v2/list?page=${page}&limit=${limit}`;
	const response = await fetch(API_URL);
	// handle 404
	if (!response.ok) {
		throw new Error(`An error occurred: ${response.status}`);
	}
	return await response.json();
};

// show the quotes
const showQuotes = (quotes) => {
	quotes.forEach((quote) => {
		const quoteEl = document.createElement("div");
		quoteEl.classList.add("main__card");

		quoteEl.innerHTML = `

        <span>${quote.id})</span>
        <div class="main__card_content">
            <h3>
            ${quote.author}
            </h3>
            <p>
            ${quote.quote}
            </p>
            <a href="#" class="main__show-more">
                Show more...
            </a>
            <div class="main__card_bottom d-flex align-items-center">
                <a href="#" class="main__save main__btn">
                    Save to collection
                </a>
                <a href="#" class="main__share main__btn">
                    Share
                </a>
            </div>
        </div>
    `;

		quotesEl.appendChild(quoteEl);
	});
};

const hideLoader = () => {
	loaderEl.classList.remove("show");
};

const showLoader = () => {
	loaderEl.classList.add("show");
};

const hasMoreQuotes = (page, limit, total) => {
	const startIndex = (page - 1) * limit + 1;
	return total === 0 || startIndex < total;
};

let isLoading = false;

// control variables
let currentPage = 1;
const limit = 20;
let total = 1025;

// load quotes
const loadQuotes = async (page, limit) => {
	if (isLoading) {
		return;
	}
	// show the loader
	showLoader();
	isLoading = true;

	// 0.5 second later
	setTimeout(async () => {
		try {
			// if having more quotes to fetch
			if (hasMoreQuotes(page, limit, total)) {
				// call the API to get quotes
				const response = await getQuotes(page, limit);
				console.log(response);
				// show quotes
				showQuotes(response);
				// update the total
			}
		} catch (error) {
			console.log(error.message);
		} finally {
			currentPage++;
			hideLoader();
			isLoading = false;
		}
	}, 500);
};

window.addEventListener(
	"scroll",
	() => {
		const { scrollTop, scrollHeight, clientHeight } =
			document.documentElement;

		if (
			scrollTop + clientHeight >= scrollHeight - 100 &&
			hasMoreQuotes(currentPage, limit, total)
		) {
			loadQuotes(currentPage, limit);
		}
	},
	{
		passive: true,
	}
);

// initialize
// loadQuotes(currentPage, limit);

(function () {
	// darkMode

	// check for saved 'darkMode' in localStorage
	let darkMode = localStorage.getItem("darkMode");

	const darkModeToggle = document.querySelector("#dark-mode-toggle");

	const enableDarkMode = () => {
		// 1. Add the class to the body
		document.body.classList.add("darkmode");
		// 2. Update darkMode in localStorage
		localStorage.setItem("darkMode", "enabled");
	};

	const disableDarkMode = () => {
		// 1. Remove the class from the body
		document.body.classList.remove("darkmode");
		// 2. Update darkMode in localStorage
		localStorage.setItem("darkMode", null);
	};

	// If the user already visited and enabled darkMode
	// start things off with it on
	if (darkMode === "enabled") {
		enableDarkMode();
	}

	// When someone clicks the button
	darkModeToggle.addEventListener("click", () => {
		// get their darkMode setting
		darkMode = localStorage.getItem("darkMode");

		// if it not current enabled, enable it
		if (darkMode !== "enabled") {
			enableDarkMode();
			// if it has been enabled, turn it off
		} else {
			disableDarkMode();
		}
	});
})();
