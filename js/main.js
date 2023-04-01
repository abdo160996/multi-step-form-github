// show steps

const allSteps = document.querySelectorAll("form .step");
const thankStep = document.querySelector(".thanks-step");
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");
const stepNums = document.querySelectorAll("aside .sidebar .icon");
const monthYearPlan = document.querySelector("#sub");
const changePlanBtn = document.querySelector("#changePlan");
const addonss = document.querySelectorAll(".addons .addon");
const addonChecks = document.querySelectorAll(".addons .form-check-input");
const planName = document.querySelector(".plan-name");
const planPriceSp = document.querySelector(".plan-price");
const monthPlan = document.querySelector("#month-plan");
const yearPlan = document.querySelector("#year-plan");
const monthlyAddons = document.querySelector("#monthly-addons");
const yearlyAddons = document.querySelector("#yearly-addons");
const checkoutForm = document.getElementById("checkoutForm");
const mplanCards = document.querySelectorAll("#month-plan .plan");
const yplanCards = document.querySelectorAll("#year-plan .plan");
const monthlyPlanBtns = document.querySelectorAll("#month-plan .plan-type");
const yearlyPlanBtns = document.querySelectorAll("#year-plan .plan-type");
const darkModeBtn = document.querySelector("#darkmode");
const themeMode = document.querySelector(".theme-mode");

//checker
document.addEventListener("DOMContentLoaded", function () {
  const mediaState = window.matchMedia("(prefers-color-scheme:dark)");

  mediaState.matches ? darkMode() : window.localStorage.getItem("theme") === "dark" ? darkMode() : lightMode();
});

//Btn
darkModeBtn.addEventListener("change", toggleDarkMode);

//apply darkMode
function toggleDarkMode() {
  darkModeBtn.checked ? darkMode() : lightMode();
}
function darkMode() {
  themeMode.classList.add("dark-on")
  document.body.classList.add("dark-mode");
  window.localStorage.setItem("theme", "dark");
}
function lightMode() {
  themeMode.classList.remove("dark-on")
  document.body.classList.remove("dark-mode");
  window.localStorage.setItem("theme", "light");
}


//vars
let currentStep = 0;
const addonPlanPrices = new Map();
const addonsPrices = [];
const planPrices = {
  arcade: { name: arcade, month: 9, year: 100 },
  advanced: { name: advanced, month: 12, year: 120 },
  pro: { name: pro, month: 20, year: 150 },
};
const addonData = {
  onlineservice: { name: "online service", month: 1, year: 10 },
  largestorage: { name: "large storage", month: 2, year: 20 },
  customprofile: { name: "custom profile", month: 1, year: 20 },
};

monthYearPlan.addEventListener("change", changePlan);
changePlanBtn.addEventListener("click", function () {
  currentStep = 1;
  updateStep();
  document.querySelector(".summary-step .total").remove();
});


//Run
updateStep();
choosePlan();
chooseAddons();

//form steps
function updateStep() {
  stepNums.forEach((stepNum) => {
    stepNum.classList.remove("checked");
  });
  stepNums[currentStep].classList.add("checked");


  allSteps.forEach((step) => {
    step.classList.add("d-none");
  });
  allSteps[currentStep].classList.remove("d-none");

  if (currentStep == 0) {
    backBtn.classList.add("d-none");
  } else {
    backBtn.classList.remove("d-none");
  }

  if (currentStep == allSteps.length - 1) {
    nextBtn.innerHTML = "Confirm";
    totalCalc();
    nextBtn.classList.add("done");
  } else {
    nextBtn.innerHTML = "Next";
    nextBtn.classList.remove("done");
  }
}

nextBtn.addEventListener("click", nextStep);
backBtn.addEventListener("click", backStep);

function nextStep(e) {

  if (!formChecker()) {
    return
  }
  if (nextBtn.classList.contains("done")) {
    console.log(currentStep)
    // e.preventDefault()
    setTimeout((
    checkoutForm.submit()
    ), 2000)
    checkoutForm.classList.add("d-none");
    thankStep.classList.remove("d-none");
  }
  else {
    currentStep++;
    updateStep();
  }

}

function backStep() {
  if (currentStep == 3) {
    document.querySelector(".summary-step .total").remove();
    currentStep--;
    updateStep();
  } else {
    currentStep--;
    updateStep();
  }
}

// remove any addon if plan changed
function removeIfChange() {
  let addonDiv = document.querySelectorAll(".summary-step .addon");
  if (addonDiv) {
    addonDiv.forEach((addon) => {
      removeAddon(addon.id);
    });
  }
}
//change plan Month --> Year
function changePlan() {
  //in yearly mode
  if (monthYearPlan.checked) {
    monthPlan.classList.add("d-none");
    monthlyAddons.classList.add("d-none");
    yearPlan.classList.remove("d-none");
    yearlyAddons.classList.remove("d-none");
    choosePlan(yearlyPlanBtns, yplanCards);

    removeIfChange();
  }
  // in monthly mode
  else {
    monthPlan.classList.remove("d-none");
    monthlyAddons.classList.remove("d-none");
    yearPlan.classList.add("d-none");
    yearlyAddons.classList.add("d-none");
    removeIfChange();
  }
}
//choose plan
function choosePlan(btns = monthlyPlanBtns, plans = mplanCards) {
  btns.forEach((btn, ind) => {
    btn.addEventListener("click", function () {
      plans.forEach((plan) => {
        plan.classList.remove("checked");
      });
      if (btn.checked) {
        addPlan(btn.value);
        plans[ind].classList.add("checked");
      }
    });
  });
}

//add plan to summary
function addPlan(btnValue) {
  let [dur, type] = btnValue.split("-");
  let period = dur == "month" ? "Month" : "Year";
  let planPrice = planPrices[type][dur];
  planName.innerHTML = `${type} (${period}ly)`;
  planPriceSp.innerHTML = `+$${planPrice}/${period}`;
  addonPlanPrices.set("planType", period);
  addonPlanPrices.set("planPrice", planPrice);
}

// choose add-on services
function chooseAddons() {
  
  addonChecks.forEach((check) => {
    check.addEventListener("click", function () {
      if (check.checked) {
        addons(check);
        check.parentElement.parentElement.classList.add("checkAddon");
      } else {
        check.parentElement.parentElement.classList.remove("checkAddon");
        removeAddon(check.value);
      }
    });
  });
//   addonss.forEach((addon) => {
//   addon.addEventListener("click", function () {
//     const addonChecked = addon.querySelector(".form-check-input");
//     if (addonChecked.checked) {
//       addonChecked.checked = false;
//       this.classList.remove("checkAddon");
//       removeAddon(addonChecked.value);
//     } else {
//       addonChecked.checked = true;
//       this.classList.add("checkAddon");
//       addons(addonChecked);
//     }
//   });
// });
}

//add Addons to summary
function addons(check) {
  let [dur, type] = check.value.split("-");
  let addonName = type.toLowerCase();
  let addonDur = dur == "month" ? "Month" : "Year";
  let addonPrice = addonData[addonName][dur];
  let addonNamePrice = {};
  addonNamePrice.addonName = addonName;
  addonNamePrice.addonPrice = addonPrice;
  addonNamePrice.addonDur = addonDur;
  addonsPrices.push(addonNamePrice);
  // update Prices Map
  addonPlanPrices.set("addons", addonsPrices);

  const summaryAddonDiv = document.querySelector(".summary-step .summary");
  const addonDiv = document.createElement("div");
  const addonNameSp = document.createElement("span");
  const addonPriceSp = document.createElement("span");
  addonDiv.classList.add("addon", "p-3", "mb-2", "mb-md-2", "d-flex", "align-items-center");
  addonDiv.id = check.value;

  addonNameSp.classList.add("me-auto", "addon-name");
  addonPriceSp.classList.add("ms-auto", "addon-price");
  addonNameSp.innerHTML = addonData[addonName]["name"];
  addonPriceSp.innerHTML = `+$${addonPrice}/${addonDur}`;
  addonDiv.append(addonNameSp, addonPriceSp);
  summaryAddonDiv.append(addonDiv);
}
function removeAddon(id) {
  document.getElementById(id).remove();

  let [, name] = id.split("-");
  let addonName = name.toLowerCase();

  addonPlanPrices.get("addons").forEach((element, ind, arr) => {
    if (element.addonName === addonName) {
      arr.splice(ind, 1);
    }
  });
}

function totalCalc() {
  console.log(addonPlanPrices);

  const totalSummary = document.querySelector(".summary-step");
  const totalDiv = document.createElement("div");
  totalDiv.classList.add("total", "p-3", "mb-2", "mb-md-3", "d-flex", "align-items-center");
  const totalDur = document.createElement("span");
  const totalPrice = document.createElement("span");
  totalDur.classList.add("me-auto", "total-dur");
  totalPrice.classList.add("ms-auto", "total-price");
  totalDur.innerHTML = `Total Per (${addonPlanPrices.get("planType")})`;
  totalPrice.innerHTML = doCalc();
  totalDiv.append(totalDur, totalPrice);
  totalSummary.append(totalDiv);
}

function doCalc() {
  let planPrice = addonPlanPrices.get("planPrice");
  let addonsPrices = 0;

  if (addonPlanPrices.has("addons")) {
    addonsPrices = addonPlanPrices.get("addons").reduce((sum, curr) => {
      return sum + curr.addonPrice;
    }, 0);
  }
  return `${planPrice + addonsPrices}/${addonPlanPrices.get("planType")}`;
}


//disabling form submissions if there are invalid fields
function formChecker() {
  let valid = true;
  if (currentStep == 0) {
    let email = checkoutForm.email;
    let name = checkoutForm.name;
    if (!isValidName(name)) {
      valid = false;
    }
    if (!isValidEmail(email)) {
      valid = false;
    }
    return valid;
  }
  if (currentStep == 1) {
    if (monthYearPlan.checked) {
      if (!validatePlans(yearlyPlanBtns)) {
        valid = false;
      }
    }
    else {
      if (!validatePlans()) {
        valid = false;
      }
    }
    return valid;
  }
  if (currentStep == 2) {
    return valid
  }

}

function isValidName(name) {
  let validName = true;
  let re = /\w{3,}/ig;
  if (!re.test(name.value)) {
    validName = false;
    name.classList.remove("is-valid");
    name.classList.add("is-invalid");
  }
  else {
    name.classList.remove("is-invalid");
    name.classList.add("is-valid");
  }
  return validName

}

function isValidEmail(email) {
  let validEmail = true;
  let re = /[a-zA-Z0-9]+@[a-zA-Z0-9]+.\w{1,}/ig;
  if (!re.test(email.value)) {
    validEmail = false;
    email.classList.remove("is-valid");
    email.classList.add("is-invalid");
  }
  else {
    email.classList.remove("is-invalid");
    email.classList.add("is-valid");
  }
  return validEmail
}

function validatePlans(btns = monthlyPlanBtns) {
  let validPlan = true;
  let feedback = document.querySelector(".bad-feedback");
  let checkedCount = 0;
  btns.forEach((inp) => {
    if (inp.checked) {
      checkedCount++;
    }
  })
  if (checkedCount == 0) {
    feedback.classList.remove("d-none")
    validPlan = false
  }
  else {
    feedback.classList.add("d-none")
  }
  return validPlan;
}

