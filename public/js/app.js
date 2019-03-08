setDismissableFlash();
initSearchBox();
followAjax();

function setDismissableFlash () {
    const dismissableFlash = document.getElementById("dismissable-flash");

    if (dismissableFlash) {
        dismissableFlash.addEventListener("click", (e) => {
            e.target.parentNode.removeChild(e.target);
        });
    }
}

function initSearchBox () {
    const findInput = document.getElementById("js-find-input"),
        findForm = document.getElementById("js-find-form");

    if (findForm && findInput) {
        findForm.addEventListener("submit", (e) => {
            e.preventDefault();
            location.href = `${location.origin}/find?${findInput.value}`;
        })
    }
}

function followAjax() {
    const followButtons = [...document.getElementsByClassName("js-manage-follow")];
    followButtons.forEach(followButton => {
        followButton.addEventListener("click", e => {
            e.preventDefault();
            const request = new XMLHttpRequest();
            request.open("get", e.target.href + "&ajax");
            request.send();
            request.onload = ({ target }) => {
                const { content, oldAction, action } = JSON.parse(target.responseText);
                e.target.innerHTML = content;
                e.target.href = e.target.href.replace(oldAction, action);
            };
        });
    });
}