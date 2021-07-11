// ==UserScript==
// @name     Add links to jira
// @version  6.0
// @grant    none
// ==/UserScript==

// Supposed to run on atlassian.net/jira/.
(() => {
  /**
   * Attempts to find all of the spans for project tasks in the page, and transform them into direct links.
   */
  const addLinks = () => {
    const projectsPrefix = "/jira/software/projects/"
    // script doesn't work on other pages;
    if (!window.location.pathname.startsWith(projectsPrefix)) return;

    const projectName = window.location.pathname.replace(projectsPrefix, "").split("/")[0];

    const spans = [...document.getElementsByTagName("SPAN")]
      .filter(s => s.innerText.includes(projectName + "-"))
      .filter(s => s.parentElement.tagName !== "A");

    spans.forEach(span => {
      //partially based on https://jsfiddle.net/barney/kDjuf/
      const link = document.createElement('a');
      for (let i = 0, l = span.attributes.length; i < l; ++i) {
        const nodeName = span.attributes.item(i).nodeName;
        const nodeValue = span.attributes.item(i).nodeValue;
        link.setAttribute(nodeName, nodeValue);
      }
      link.innerHTML = span.innerHTML;
      link.href = "/browse/" + link.innerText;
      link.target = "_blank";
      link.addEventListener("click", (event) => {
        event.stopPropagation(); // to not open a modal and just navigate by link
      })
      span.parentNode.replaceChild(link, span);
    })
    return spans.length === 0;
  }

  /**
   * Moves the filters in the backlog up to be able to show more issues.
   */
  const compactHeaders = () => {
    const headerWrapper = document.querySelector(`div[data-test-id="software-backlog.page-header"]`);
    if (headerWrapper.getAttribute("data-ars-upd") === "true") return;

    const headerBlock = headerWrapper.children[0];
    headerBlock.style.marginTop = "16px"; //originally 24px
    headerBlock.style.marginBottom = "-8px"; //originally 16px
    const header = headerBlock.children[1];
    const filters = headerBlock.children[headerBlock.children.length - 1];
    header.style.display = "inline-flex";
    filters.style.display = "inline-flex";
    headerWrapper.setAttribute("data-ars-upd", "true");
  };

  //all the funcitons to be run
  const funcs = [
    addLinks,
    compactHeaders,
  ]

  const run = () => {
    funcs.forEach(func => func());
  }

  setInterval(run, 1000)
})();