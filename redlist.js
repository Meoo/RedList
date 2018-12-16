(function() {

var whitelist = [];
var redlist = [];
var angry = false;
var noBox = [ "B", "I", "SPAN" ];

// Add current domain to whitelist
whitelist.push(
    document.URL.slice(document.URL.indexOf("://") + 3).split("/")[0]);

function processNode(node) {
  var href = node.getAttribute("href");
  if (!href) {
    return;
  }

  for (var whitepattern of whitelist) {
    if (href.match(whitepattern)) {
      return;
    }
  }

  var match = false;
  for (var redpattern of redlist) {
    if (href.match(redpattern)) {
      match = true;
      break;
    }
  }

  if (!match) {
    return;
  }

  var hasChilds = false;
  for (var child = node.firstElementChild; child;
       child = child.nextElementSibling) {
    if (!noBox.includes(child.tagName)) {
      console.log(href + " " + child.tagName);
      hasChilds = true;
      break;
    }
  }

  if (!hasChilds) {
    node.classList.add("redlink-hl");
    if (angry) {
      node.classList.add("redlink-angry");
    }
  } else {
    node.classList.add("redlink-box");
  }
}

var nodes = document.querySelectorAll("a");
var i;
for (i = 0; i < nodes.length; ++i) {
  processNode(nodes[i]);
}

var observer = new MutationObserver(function(mutations) {
  for (var mutation of mutations) {
    if (mutation.type == "childlist") {
      for (var node of mutation.addedNodes) {
        if (node.tagName == "A") {
          processNode(node);
        }
      }
    } else if (mutation.type == "attributes") {
      if (mutation.target.tagName == "A") {
        processNode(mutation.target);
      }
    }
  }
});
observer.observe(document.body);
})()
