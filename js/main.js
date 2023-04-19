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
