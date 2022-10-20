import "./css/index.css"
import IMask from "imask"

// para pegar algo no HTML usando DOM
const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

// Atribuir cores diferentes para o tipo de cartao
function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57D2"],
    mastercard: ["#DF6F29", "#C69347"],
    nubank: ["#A72DF2", "#3D0B64"],
    dhl: ["#EEFD3E", "#FF0000"],
    fedex: ["#7000FF", "#FF7527"],
    americancard: ["#001AFF", "#FFFFFF"],
    default: ["black", "gray"],
  }
  // Pegar o array de cores e editar no hmtl usando DOM
  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}
// deixar o cartao global para testar no site exemplo: window.setCardType("americancard")
globalThis.setCardType = setCardType

// Pegar na tela o Security Code e atribuir a uma variavel
const securityCode = document.getElementById("security-code")

// Criar uma mascara para validar o Security Code
const securityCodePattern = {
  mask: "0000",
}
// Colocar a mascara padrao em uma variavel para usar no futuro para validar o Security Code
const securityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDate = document.getElementById("expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^6\d{0,15}/,
      cardtype: "americancard",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^7\d{0,15}/,
      cardtype: "dhl",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^8\d{0,15}/,
      cardtype: "fedex",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^9\d{0,15}/,
      cardtype: "nubank",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")

    //Uma forma de fazer a mascara do tipo de cartao
    //const foundMask = dynamicMasked.compiledMasks.find(({regex}) => number.match(regex))
    // Otra forma de fazer a mascara do tipo de cartao
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })
    console.log(foundMask)

    return foundMask
  },
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  alert("Cartao adicionado!")
})

// tirar o carregamento da pagina quando clica no botao criar um cartao
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

//Deixar dinamico quando digita o nome, sem mascara
const carHolder = document.querySelector("#card-holder")
carHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")

  ccHolder.innerText =
    carHolder.value.length === 0 ? "FULANO DA SILVA" : carHolder.value
})

// Deixar dinamico quando digita o CVC com mascara - MASK
securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")

  ccSecurity.innerText = code.length === 0 ? "123" : code
}

// Deixar dinamico quando digita o Numero do cartao com mascara - MASK
// e mudar dinamicamente o tipo de cartao com o setCardType
cardNumberMasked.on("accept", () => {
  const cardtype = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardtype)
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")

  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

// Deixar dinamico quando digita a data da expiracao do cartao com mascara - MASK
expirationDateMasked.on("accept", () => {
  UpdateExpirationDate(expirationDateMasked.value)
})

function UpdateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-extra .value")

  ccExpiration.innerText = date.length === 0 ? "02/32" : date
}
