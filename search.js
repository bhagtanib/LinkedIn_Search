console.log("Chrome Extension waiting");
var count  = 1
async function waitForOneSecond() {
  return new Promise((resolve) => {
    setTimeout(resolve, 5000);
  });
}

async function openLinksInTabs(allLinks) {
  for (let i = 0; i < allLinks.length; i++) {
    var el = allLinks[i].getElementsByClassName("entity-result__universal-image")[0].querySelector('a.app-aware-link');
    console.log(count, el);
    window.open(el)
    count++
    await waitForOneSecond();
  }
}

async function browseNextPage() {
  const nextButton = document.querySelector('[aria-label="Next"]');
  if (nextButton && nextButton.disabled != true) {
    console.log("Next button found:", nextButton);
    nextButton.click();
    observer.disconnect();
    await waitForOneSecond(); // Wait after clicking "Next"
    await waitForOneSecond(); // Wait after clicking "Next"
    console.log("Going to a new page");
    // Disconnect the previous observer before navigating to the next page
    run();
  } else {
    console.log("Next button not found or no more pages.");
  }
}

let observer; // Declare the observer variable outside the functions

function createObserver() {
  const newObserver = new MutationObserver(checkForNextElement);
  const config = { childList: true, subtree: true };
  newObserver.observe(document.body, config);
  return newObserver;
}

function checkForNextElement(mutationsList, observer) {
  const nextButton = document.querySelector('[aria-label="Next"]');
  if (nextButton) {
    console.log("Next button found:", nextButton);
    nextButton.click();
    // Disconnect the previous observer before navigating to the next page
    observer.disconnect();
    observer("disconnected")
    run();
  } else {
    console.log("Next button not found or no more pages.");
  }
}

async function run() {
  var allLinks = document.getElementsByClassName(
    "reusable-search__result-container"
  );
  console.log("ALl likns: ", allLinks)
  if (allLinks.length > 0) {
    await openLinksInTabs(allLinks);

    // Create a new observer for the current page
    observer = createObserver();
    await browseNextPage(); // Continue to the next page
    waitForOneSecond()
    waitForOneSecond()
  } else {
    console.log("No links found on this page.");
  }
}

// Call the run function to start the process
run();
