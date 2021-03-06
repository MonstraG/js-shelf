// ==UserScript==
// @name         Jira improver
// @namespace    http://tampermonkey.net/
// @version      9.1
// @description  Improves things about jira
// @author       Arseny Garelyshev
// @match        https://*.atlassian.net/jira/*
// @icon         https://aid-frontend.prod.atl-paas.net/atlassian-id/front-end/5.0.246/favicon.ico
// @grant        none
// ==/UserScript==

(() => {
  /**
   * Attempts to find all of the spans for project tasks in the page, and transform them into direct links.
   * also colors them blue for visibility
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
      link.style.color = "#0645AD";
      span.parentNode.replaceChild(link, span);
    })
    return spans.length === 0;
  }

  /**
   * Moves the filters in the backlog up to be able to show more issues.
   */
  const compactHeaders = () => {
    const headerWrapper = getByAttr("software-backlog.page-header");
    if (!headerWrapper) return;

    const headerBlock = headerWrapper.children[0];
    headerBlock.style.marginTop = "16px"
    headerBlock.style.marginBottom = "0";
    const header = headerBlock.children[1];
    const filters = headerBlock.children[headerBlock.children.length - 1];
    header.style.display = "inline-flex";
    filters.style.display = "inline-flex";

    const filtersWrapper = filters.children[0];
    filtersWrapper.style.marginBottom = "0";
    filtersWrapper.style.marginTop = "0";

    const backlogWrapper = header.children[0];
    backlogWrapper.style.marginBottom = "0";
    backlogWrapper.children[0].children[0].style.marginBottom = "0"; // h1 > div

    setUpdatedAttr(headerWrapper);
  };

  /**
   * Board view for jira has 40px folds on the left and right that introduce scroll and hide small parts of the board when
   * it's exactly half of a 1920 screen with only 3 columns.
   * This gets rid of them
   */
  const hideBoardFolds = () => {
    const boardWrapper = getByAttr("platform-board-kit.ui.board.scroll.board-scroll");
    if (!boardWrapper) return;

    const boardSection = [...boardWrapper.children].find(ch => ch.tagName === "SECTION");
    const [leftFold, , plus, rightFold] = [...boardSection.children]; //unused variable is `board`
    leftFold.style.display = "none";
    rightFold.style.display = "none";

    //also remove unneeded right padding on plus
    const plusButtonWrapperWithPadding = plus.children[0].children[0];
    plusButtonWrapperWithPadding.style.paddingRight = "0";

    //set in showEpicsInBoard
    // setUpdatedAttr(boardWrapper);
  }

  /**
   * If you click on a epic in roadmap, issue viewer on the right is too small. This expands it.
   */
  const expandRoadmapIssueViewer = () => {
    const viewerWrapper = getByAttr("roadmap.standard-roadmap.table-overlay.panel.container");
    if (!viewerWrapper) return;

    // if bigger than this, their layout changes into two columns.
    viewerWrapper.style.width = "600px";
    setUpdatedAttr(viewerWrapper);
  }

  /**
   * Inserts an iframe showing the first column of the roadmap before all other columns.
   */
  const showEpicsInBoard = () => {
    const boardWrapper = getByAttr("platform-board-kit.ui.board.scroll.board-scroll")
    if (!boardWrapper) return;

    const columns = boardWrapper.querySelector("section")
    columns.style.padding = "0 0 0 20px";

    //add the thing
    const iframe = document.createElement("iframe");
    iframe.id = "ars-custom-iframe-1";
    iframe.setAttribute("src", "/jira/software/projects/VUL/boards/1/roadmap");
    iframe.height = "1000";
    iframe.width = "440";
    iframe.style.border = "none";
    iframe.style.transition = "all 0.2s";
    columns.insertBefore(iframe, columns.firstChild);

    iframe.addEventListener("load", () => {
      iframe.contentDocument.querySelector("head").appendChild(document.createElement("style")).innerHTML = `
      #ak-main-content > div > div {
        padding: 0;
      }
      #jira-frontend > div > div {
       display: block;
      }
      #ak-jira-navigation, 
      #ak-side-navigation,
      #ak-main-content > div > div > div:first-child,
      #sr-timeline > div > :not(:first-child) {
        display: none;
      }
      #sr-timeline > div > div:first-child {
        width: 270px !important;
      }
      #sr-timeline > div > div:first-child > div:first-child > div:last-child {
        display: none;
      }
      #ak-main-content > div > div > div:last-child > div:last-child {
        width: 440px !important;
      }
      `;
    });

    setUpdatedAttr(boardWrapper);
  }

  const getByAttr = (attr) => {
    const viewerWrapper = document.querySelector(`div[data-test-id="${attr}"]`);
    return !viewerWrapper || viewerWrapper.getAttribute("data-ars-upd") === "true" ? null : viewerWrapper;
  }

  const setUpdatedAttr = (el) => el.setAttribute("data-ars-upd", "true");

  /**
   * Changes styles for issue rows on small screens
   */
  const addImprovedIssueStyles = () => {
    const id = "ars-issue-styles"
    const existing = document.getElementById("ars-issue-styles");
    if (existing) return;

    const styles = document.createElement("style");
    styles.id = id;
    document.querySelector("head").appendChild(styles).innerHTML = `
        @media (max-width: 1400px) {
          div[data-test-id="issue.views.issue-details.issue-layout.issue-layout"] div[data-rbd-draggable-id] div,
          div[data-test-id="issue.views.issue-details.issue-layout.issue-layout"] div[data-rbd-draggable-id] a {
            padding: 0;
          }
        }
    `;
  }

  //all the functions to be run
  const funcs = [
    addLinks,
    compactHeaders,
    hideBoardFolds,
    expandRoadmapIssueViewer,
    showEpicsInBoard,
    addImprovedIssueStyles
  ];
  const run = () => funcs.forEach(func => func());
  run();
  setInterval(run, 3000);
})();