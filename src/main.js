import "./css/index.css";
import IMask from "imask";

const ccBgColor01 = document.querySelector(
  ".cc-bg svg > g g:nth-child(1) path"
);
const ccBgColor02 = document.querySelector(
  ".cc-bg svg > g g:nth-child(2) path"
);
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");

function setCardType(type) {
  const colors = {
    visa: ["#436099", "#2057f2"],
    mastercard: ["#df6f29", "#c69347"],
    default: ["black", "gray"],
  };

  ccBgColor01.setAttribute("fill", colors[type][0]);
  ccBgColor02.setAttribute("fill", colors[type][1]);

  ccLogo.setAttribute("src", `/cc-${type}.svg`);
}

globalThis.setCardType = setCardType;

const securityCode = document.querySelector("#security-code");
const securityMask = IMask(securityCode, { mask: "0000" });

const dateExpiration = document.querySelector("#expiration-date");
const dateExpirationPattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: "01",
      to: "12",
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
};

const dateExpirationMask = IMask(dateExpiration, dateExpirationPattern);

const cardNumber = document.querySelector("#card-number");
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardType: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardType: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardType: "default",
    },
  ],

  dispatch: (appended, dynamicMasked) => {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "");
    const foundMask = dynamicMasked.compiledMasks.find((item) => {
      return number.match(item.regex);
    });

    return foundMask;
  },
};

const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

//Implementando valores

const ccHolder = document.querySelector("#card-holder");
ccHolder.addEventListener("input", () => {
  const holderValue = document.querySelector(".cc-holder .value");

  holderValue.innerText =
    ccHolder.value.length === 0 ? "FULANO DA SILVA" : ccHolder.value;
});

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardType;
  setCardType(cardType);
  updateCardNumber(cardNumberMasked.value);
});

function updateCardNumber(code) {
  const ccCardNumber = document.querySelector(".cc-number");

  ccCardNumber.innerText = code.length === 0 ? "0000 0000 0000 0000" : code;
}

const inputDateExpiration = document.querySelector("#expiration-date");
inputDateExpiration.addEventListener("input", () => {
  const dateExpirationValue = document.querySelector(".cc-expiration .value");

  dateExpirationValue.innerHTML = inputDateExpiration.value;
});

securityMask.on("accept", () => {
  updateSecurityCode(securityMask.value);
});

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value");

  ccSecurity.innerText = code.length === 0 ? "123" : code;
}

dateExpirationMask.on("accept", () => {
  updateExpirationDate(dateExpirationMask.value);
});

function updateExpirationDate(date) {
  const dateExpirationValue = document.querySelector(".cc-extra .value");

  dateExpirationValue.innerHTML = date.length === 0 ? "02/32" : date;
}
