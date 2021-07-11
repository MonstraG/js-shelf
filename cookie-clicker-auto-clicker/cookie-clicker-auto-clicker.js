(() => {
  if (Game.mods.CookieMonster == null) {
    Game.LoadMod('https://aktanusa.github.io/CookieMonster/CookieMonster.js');
  }

  const click = (el) => el.dispatchEvent(new Event("click"));

  const region = document.getElementById('sectionLeft');

  const btn = document.createElement("button");
  btn.classList.add("toggle-auto-clicker");

  const css = `
    .toggle-auto-clicker {
      height: 48px;
      width: 225px;
      position: absolute;
      z-index: 6;
      bottom: 1rem;
      background: url(img/storeTile.jpg);
      background-size: cover;
      border: none;
      cursor: pointer;
    }

    .toggle-auto-clicker:hover {
      box-shadow: 0px 0px 16px #fff inset, 0px 0px 1px #000;
      z-index: 20;
      filter: brightness(115%);
      -webkit-filter: brightness(115%);
    }

    .toggle-auto-clicker.enabled {
      opacity: 0.8;
      box-shadow:0px 0px 16px #000 inset;
    }
  `;
  const style = document.createElement('style');

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  document.getElementsByTagName('head')[0].appendChild(style);


  btn.innerHTML = 'Toggle auto-clicker (OFF)';

  const toggleInterval = () => {
    let bigCookieInterval = null;
    let buyUpgradeInterval = null;
    let goldenCookieInterval = null;
    let researchInterval = null;
    let wrinklerInterval = null;
    let enabled = false;
    const bigCookie = document.getElementById('bigCookie');
    return () => {
      enabled = !enabled;
      if (enabled) {
        bigCookieInterval = setInterval(() => click(bigCookie), 5);
        buyUpgradeInterval = setInterval(() => tryUpgrade(), 500);
        goldenCookieInterval = setInterval(tryClickOnGoldenCookie, 1000);
        researchInterval = setInterval(tryResearch,1000);
        wrinklerInterval = setInterval(popWrinklers, 5*60*1000); //5 min
        btn.innerHTML = 'Toggle auto-clicker (ON)';
        btn.classList.add("enabled");
      } else {
        clearInterval(bigCookieInterval);
        clearInterval(buyUpgradeInterval);
        clearInterval(goldenCookieInterval);
        clearInterval(researchInterval);
        clearInterval(wrinklerInterval);
        btn.innerHTML = 'Toggle auto-clicker (OFF)';
        btn.classList.remove("enabled");
      }
    };
  };
  btn.onclick = toggleInterval();

  region.appendChild(btn);

  const updatePos = () => btn.style.left = `${region.offsetWidth / 2 - 100}px`;
  document.addEventListener("resize", updatePos);
  updatePos();

  const getUpgradeInfo = (el) => {
    const id = el.onclick.toString().split("Game.UpgradesById[")[1].split("].click(event)")[0];
    return Game.UpgradesById[id];
  }

  /* AUTO-UPGRADING */
  const upgradesTab = document.getElementById("upgrades");
  const tryUpgrade = () => {
    const blueUpgrades = [...upgradesTab.getElementsByClassName("CMBackBlue")].map(upgrade => upgrade.parentElement);
    const grayUpgrades = [...upgradesTab.getElementsByClassName("CMBackGray")].map(upgrade => upgrade.parentElement).filter(u => {
      const data = getUpgradeInfo(u);
      return data.basePrice / 100 < Game.cookiesPs;
    });
    const goodUpgrades = [...grayUpgrades, ...blueUpgrades]

    if (goodUpgrades.length === 0) {
      const hasBadUpgrades = tryBuyBadUpgrades();
      if (!hasBadUpgrades) {
        //try build 5 times every 50 ms
        for (let i = 0; i < 10; i++) {
          setTimeout(tryBuild, 25 * i);
        }
      }
      return;
    }

    const upgradeToBuy = goodUpgrades
      .filter(upgrade => upgrade.classList.contains("enabled")).shift();

    if (upgradeToBuy) {
      const upgradeName = getUpgradeInfo(upgradeToBuy).name;
      click(upgradeToBuy);
      console.log("Bought upgrade", upgradeName);
    }
  };

  const tryBuyBadUpgrades = () => {
    const allUpgrades = [...upgradesTab.children].filter(u => u.classList.contains("enabled"))
    const upgrade = allUpgrades
      .map(u => [u, getUpgradeInfo(u)])
      .filter(([el, data]) => data.basePrice < Game.cookiesPs).shift();

    if (upgrade) {
      click(upgrade[0])
      console.log("Bought upgrade (bad)", upgrade[1].name);
    }
    return upgrade;
  }

  /* AUTO-BUILDING */
  const tryBuild = () => {
    const buildingsTab = document.getElementById("products");
    const prices = [...buildingsTab.getElementsByClassName("price")];
    const bestBuyPrice = prices.filter(price => price.style.color === `rgb(0, 255, 0)`).shift();
    if (bestBuyPrice) {
      const bestBuy = bestBuyPrice.parentElement.parentElement;
      if (bestBuy.classList.contains("enabled")) {
        click(bestBuy);
        const titles = [...bestBuy.getElementsByClassName("title")];
        const buildingName = titles.filter(title => title.className === "title").shift();
        console.log("Bought building", buildingName.innerText.trim());
      }
    }
  };

  /*AUTO-CLICKING ON GOLDEN COOKIES */
  const tryClickOnGoldenCookie = () => {
    const goldenCookies = document.getElementById("shimmers");
    const cookie = goldenCookies.children.item(0);
    if (cookie) {
      click(cookie);
      //attempts to click again in case it's golden cookie rain or whatever it's called
      setTimeout(tryClickOnGoldenCookie, 16);
      console.log("Clicked on golden cookie!");
    }
  };

  /*AUTO-RESEARCHING */
  const tryResearch = () => {
    const researchTab = document.getElementById("techUpgrades");
    const research = [...researchTab.children].filter(r => r.classList.contains("enabled")).shift();
    if (research) {
      const data = getUpgradeInfo(research);
      if (data.id === 69) return; // don't do "One mind"
      click(research);
      console.log("Researched", data.name);
    }
  };

  const popWrinklers = () => {
    document.getElementById("PopAllNormalWrinklerButton")?.click();
  }

  // technically cheating, but I cannot be bothered to wait for 7-aligned prestige value
  Game.Upgrades['Lucky digit'].showIf = () => true;
  Game.Upgrades['Lucky number'].showIf = () => true;
  Game.Upgrades['Lucky payout'].showIf = () => true;
})();