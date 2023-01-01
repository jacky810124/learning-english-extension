const BOOKMARK_TITLES = [
  "Learn english in 3 hours",
  "Learn english with tv series",
  "Learning english - BBC",
  "Let's learn english",
  "How to learn english",
  "English learning online",
  "Online free english courses",
  "BBC",
  "CNN",
  "NY Times",
];
const CONTEXT_MENU_ROOT_ID = "learning-english:rootId";
const createContextMenu = () => {
  const saveItemId = `${CONTEXT_MENU_ROOT_ID}:saveItemId`;
  chrome.contextMenus.create(
    {
      id: CONTEXT_MENU_ROOT_ID,
      title: "Learning English",
      type: "normal",
      contexts: ["page"],
    },
    () => {}
  );
  chrome.contextMenus.create(
    {
      parentId: CONTEXT_MENU_ROOT_ID,
      id: saveItemId,
      title: "Save To Bookmark",
      type: "normal",
      contexts: ["page"],
    },
    () => {}
  );
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    console.log("info", info, "tab", tab);
    if (saveItemId === info.menuItemId) {
      const pageUrl = tab.url;
      const pageTitle = tab.title;
      saveToBookmark({ pageUrl, pageTitle });
    }
  });
};
const saveToBookmark = async ({ pageUrl, pageTitle } = {}) => {
  if (!pageUrl) {
    return;
  }
  const tree = await chrome.bookmarks.getSubTree("1");
  console.log("tree", tree);
  let folder = tree?.[0].children.find(
    (item) => item.title === "Learning English" && !item.url
  );
  if (!folder) {
    folder = await chrome.bookmarks.create({
      parentId: "1",
      title: "Learning English",
    });
  }
  const folderId = folder.id;
  console.log("folderId", folderId);
  chrome.bookmarks.create({
    parentId: folderId,
    title: BOOKMARK_TITLES[Math.floor(Math.random() * BOOKMARK_TITLES.length)],
    url: pageUrl,
  });
};
const clickAction = async (tab) => {
  const pageUrl = tab.url;
  const pageTitle = tab.title;
  saveToBookmark({ pageUrl, pageTitle });
};
const removeHistory = async () => {
  const result = await chrome.history.search({
    text: "swag.live",
  });
  console.log("result", result);
  if (!result.length) {
    return;
  }
  result.forEach((item) =>
    chrome.history.deleteUrl({
      url: item.url,
    })
  );
};
const main = async () => {
  createContextMenu();
  chrome.action.onClicked.addListener(clickAction);
  chrome.tabs.onRemoved.addListener(removeHistory);
};

main();
