// listing vars here so they're in the global scope
var cards, nCards, cover, openContent, openContentText, pageIsOpen = false,
    openContentImage, closeContent, windowWidth, windowHeight, currentCard;

// initiate the process
init();

function init() {
  resize();
  selectElements();
  attachListeners();
}

// select all the elements in the DOM that are going to be used
function selectElements() {
  cards = document.getElementsByClassName('card'),
  nCards = cards.length,
  cover = document.getElementById('cover'),
  openContent = document.getElementById('open-content'),
  openContentText = document.getElementById('open-content-text'),
  openContentImage = document.getElementById('open-content-image')
  closeContent = document.getElementById('close-content');
}

/* Attaching three event listeners here:
  - a click event listener for each card
  - a click event listener to the close button
  - a resize event listener on the window
*/
function attachListeners() {
  for (var i = 0; i < nCards; i++) {
    attachListenerToCard(i);
  }
  closeContent.addEventListener('click', onCloseClick);
  window.addEventListener('resize', resize);
}

function attachListenerToCard(i) {
  cards[i].addEventListener('click', function(e) {
    var card = getCardElement(e.target);
    onCardClick(card, i);
  })
}

/* When a card is clicked */
function onCardClick(card, i) {
  // set the current card
  currentCard = card;
  // add the 'clicked' class to the card, so it animates out
  currentCard.className += ' clicked';
  // animate the card 'cover' after a 500ms delay
  setTimeout(function() {animateCoverUp(currentCard)}, 1000);
  // animate out the other cards
  animateOtherCards(currentCard, true);
  // add the open class to the page content
  openContent.className += ' open';
}

/*
* This effect is created by taking a separate 'cover' div, placing
* it in the same position as the clicked card, and animating it to
* become the background of the opened 'page'.
* It looks like the card itself is animating in to the background,
* but doing it this way is more performant (because the cover div is
* absolutely positioned and has no children), and there's just less
* having to deal with z-index and other elements in the card
*/
function animateCoverUp(card) {
  // get the position of the clicked card
  var cardPosition = card.getBoundingClientRect();
  // get the style of the clicked card
  var cardStyle = getComputedStyle(card);
  setCoverPosition(cardPosition);
  setCoverColor(cardStyle);
  scaleCoverToFillWindow(cardPosition);
  // update the content of the opened page
  openContentText.innerHTML = '<h1>'+card.children[2].textContent+'</h1>'+paragraphText;
  openContentImage.src = card.children[1].src;
  setTimeout(function() {
    // update the scroll position to 0 (so it is at the top of the 'opened' page)
    window.scroll(0, 0);
    // set page to open
    pageIsOpen = true;
  }, 300);
}

function animateCoverBack(card) {
  var cardPosition = card.getBoundingClientRect();
  // the original card may be in a different position, because of scrolling, so the cover position needs to be reset before scaling back down
  setCoverPosition(cardPosition);
  scaleCoverToFillWindow(cardPosition);
  // animate scale back to the card size and position
  cover.style.transform = 'scaleX('+1+') scaleY('+1+') translate3d('+(0)+'px, '+(0)+'px, 0px)';
  setTimeout(function() {
    // set content back to empty
    openContentText.innerHTML = '';
    openContentImage.src = '';
    // style the cover to 0x0 so it is hidden
    cover.style.width = '0px';
    cover.style.height = '0px';
    pageIsOpen = false;
    // remove the clicked class so the card animates back in
    currentCard.className = currentCard.className.replace(' clicked', '');
  }, 301);
}

function setCoverPosition(cardPosition) {
  // style the cover so it is in exactly the same position as the card
  cover.style.left = cardPosition.left + 'px';
  cover.style.top = cardPosition.top + 'px';
  cover.style.width = cardPosition.width + 'px';
  cover.style.height = cardPosition.height + 'px';
}

function setCoverColor(cardStyle) {
  // style the cover to be the same color as the card
  cover.style.backgroundColor = cardStyle.backgroundColor;
}

function scaleCoverToFillWindow(cardPosition) {
  // calculate the scale and position for the card to fill the page,
  var scaleX = windowWidth / cardPosition.width;
  var scaleY = windowHeight / cardPosition.height;
  var offsetX = (windowWidth / 2 - cardPosition.width / 2 - cardPosition.left) / scaleX;
  var offsetY = (windowHeight / 2 - cardPosition.height / 2 - cardPosition.top) / scaleY;
  // set the transform on the cover - it will animate because of the transition set on it in the CSS
  cover.style.transform = 'scaleX('+scaleX+') scaleY('+scaleY+') translate3d('+(offsetX)+'px, '+(offsetY)+'px, 0px)';
}

/* When the close is clicked */
function onCloseClick() {
  // remove the open class so the page content animates out
  openContent.className = openContent.className.replace(' open', '');
  // animate the cover back to the original position card and size
  animateCoverBack(currentCard);
  // animate in other cards
  animateOtherCards(currentCard, false);
}

function animateOtherCards(card, out) {
  var delay = 100;
  for (var i = 0; i < nCards; i++) {
    // animate cards on a stagger, 1 each 100ms
    if (cards[i] === card) continue;
    if (out) animateOutCard(cards[i], delay);
    else animateInCard(cards[i], delay);
    delay += 100;
  }
}

// animations on individual cards (by adding/removing card names)
function animateOutCard(card, delay) {
  setTimeout(function() {
    card.className += ' out';
   }, delay);
}

function animateInCard(card, delay) {
  setTimeout(function() {
    card.className = card.className.replace(' out', '');
  }, delay);
}

// this function searches up the DOM tree until it reaches the card element that has been clicked
function getCardElement(el) {
  if (el.className.indexOf('card ') > -1) return el;
  else return getCardElement(el.parentElement);
}

// resize function - records the window width and height
function resize() {
  if (pageIsOpen) {
    // update position of cover
    var cardPosition = currentCard.getBoundingClientRect();
    setCoverPosition(cardPosition);
    scaleCoverToFillWindow(cardPosition);
  }
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
}

var paragraphText = '<a href="https://mim.archi/services/architectural-design/" target="_blank"><h2>1. Architectural Design</h2></a> <p>We are a team of professional architects and interior designers. As an architectural firm, we offer a range of services throughout Pakistan. Our architectural design process begins with a discussion about your requirements. As soon as we agree on the project, we start sketching and developing concepts based on your specifications. Once the schematic design is final, we begin the development process to ensure success. <br> As part of our architectural design process, we cover these three sub-services, depending on the level of architectural services required. <ul><li>Interior Design</li><li>Structural Services</li><li>Project execution</li></ul></p> <br> <a href="https://mim.archi/services/3d-visualization/" target="_blank"><h2>2. 3D Visualization</h2></a> <p>Mimar is a provider of 3D architectural visualization and rendering services in Pakistan and is now expanding to the global market. <br> We, as an architectural visualization company, always try to make your dream project come to life with true colors. <br> Our architectural visualization studio specializes in a wide range of architectural sub-services. Here\’s a taste of what we do under architectural visualization: <br><ul><li>Renders</li><li>Cinematics</li><li>3D on Plan</li><li>3D on a construction site</li><li>Property explorer</li><li>Terrain mapping</li></ul></p> <a href="https://mim.archi/services/marketing/" target="_blank"><h2>3. Marketing</h2></a> <p>Mimar provides top of the line real estate marketing and branding services. From architecture design to visualization and then branding and marketing we got it all at one place. If you think your real estate company needs true marketing services Mimar got it for you. <br> As a certified marketing company in Islamabad, we use our expertise to promote positive change. Today, no business can last for a long time without digital marketing. In contrast, an underperforming digital marketing company can hurt even more than that.   Count on Mimar to boost your online presence with the fastest and most effective techniques. With talented experts from across the globe, we are one of the most reliable real estate marketing companies in Islamabad. Take a look at what we offer under our digital marketing umbrella. </p> <a href="https://mim.archi/services/branding/" target="_blank"><h2>4. Branding</h2></a> <p>Mimar helps you stand out from the competition to make your business more successful. As a leader in Pakistan\’s branding industry, Mimar aims to provide the best branding services possible. <br> Our real estate branding service includes two forms:<ul><li>Branding Kit</li><li>Interactive Manuals</li></ul></p><h3>Mimar makes you stand out</h3><p>We handle all aspects of marketing and branding for real estate sales or purchases. It includes everything you need to stand out from the crowd.<br>Here are the items that make up the branding kit:<ul><li>Logo design</li><li>Letterhead</li><li>Business Card</li><li>Envelope design</li><li>Notepad design</li><li>Calendar design</li><li>Stationery Items (Cups, keychains, pen drives, etc.)</li></ul></p>';