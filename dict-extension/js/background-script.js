chrome.contextMenus.create({

    type: 'normal',

    title: 'Menu Demo',

    id: 'menuDemo',

    contexts: ['all'],

    onclick: genericOnClick

}, function () {

    alert('contextMenus are create.');

});