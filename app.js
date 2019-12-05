// Storage Controller
const StorageCtrl = (function () {

  // public Methods
  return {
    storeItem: function (item) {
      let items;
      // Check if any item in LS
      if (localStorage.getItem('items') === null) {
        items = [];
        // push new item
        items.push(item);
        // Set LS
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        // get what is already in
        items = JSON.parse(localStorage.getItem('items'));

        // push new item
        items.push(item);

        // Re set LS
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: function () {
      let items = [];

      if (localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function (item, index) {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });

      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: function (id) {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function (item, index) {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });

      localStorage.setItem('items', JSON.stringify(items));
    },
    clearItemsFromStorage: function () {
      localStorage.removeItem('items');
    }
  }
})();
// Item Cntroller
const ItemCtrl = (function () {
  // item constructor
  class item {
    constructor(id, name, calories) {
      this.id = id;
      this.name = name;
      this.calories = calories;
    }
  }

  // Data Structure / State
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }

  // public Methods
  return {
    getItems: function () {
      return data.items;
    },
    addItem: function (name, calories) {
      // Create ID
      let ID;

      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      // Create a new item
      newItem = new item(ID, name, calories);

      // Add item to array
      data.items.push(newItem);

      return newItem;

    },
    getTotalCalories: function () {
      // Loop throw the items array and add the calories
      let total = 0;
      data.items.forEach(item => {
        total += item.calories;
      });

      // set the totalCalories in data structure
      data.totalCalories = total;

      return data.totalCalories;
    },
    getItemById: function (id) {
      let found = null;

      // loop through the items
      data.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });

      return found;
    },
    updateItem: function (name, calories) {
      // calories to number
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function (item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      return found;
    },
    deleteItem: function (id) {
      // Get id
      const ids = data.items.map(function (item) {
        return item.id;
      });

      // Get the index 
      const index = ids.indexOf(id);

      // remote itemd
      data.items.splice(index, 1);
    },
    clearAllItems: function () {
      data.items = [];
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    logData: function () {
      return data;
    }
  }
})();

// UI Controller
const UICtrl = (function () {
  // UI Selector
  const UISelector = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories',
  };

  // public Methods
  return {
    populateListItem: function (items) {
      let html = '';

      items.forEach(item => {
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong>
        <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content"><i class="edit-item fas fa-pencil-alt"></i></a>
      </li>`;
      });

      // insert list html
      document.querySelector(UISelector.itemList).innerHTML = html;
    },
    getItemInput: function () {
      return {
        name: document.querySelector(UISelector.itemNameInput).value,
        calories: document.querySelector(UISelector.itemCaloriesInput).value
      }
    },
    getSelectors: function () {
      return UISelector;
    },
    clearInput: function () {
      document.querySelector(UISelector.itemNameInput).value = '';
      document.querySelector(UISelector.itemCaloriesInput).value = '';
    },
    addItemToform: function () {
      UICtrl.clearInput();

      document.querySelector(UISelector.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelector.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;

      UICtrl.showEditState();
    },
    hideList: function () {
      document.querySelector(UISelector.itemList).style.display = 'none';
    },
    clearEditState: function () {
      UICtrl.clearInput();

      document.querySelector(UISelector.updateBtn).style.display = 'none';
      document.querySelector(UISelector.deleteBtn).style.display = 'none';
      document.querySelector(UISelector.backBtn).style.display = 'none';
      document.querySelector(UISelector.addBtn).style.display = 'inline';
    },
    showEditState: function () {
      document.querySelector(UISelector.updateBtn).style.display = 'inline';
      document.querySelector(UISelector.deleteBtn).style.display = 'inline';
      document.querySelector(UISelector.backBtn).style.display = 'inline';
      document.querySelector(UISelector.addBtn).style.display = 'none';
    },
    addListItem: function (item) {
      // Show the itemlist 
      document.querySelector(UISelector.itemList).style.display = 'block';

      // Create an li element 
      const li = document.createElement('li');

      // Add class 
      li.className = 'collection-item';

      // Add ID
      li.id = `item-${item.id}`;

      // Add HTML
      li.innerHTML = `<strong>${item.name}: </strong>
      <em>${item.calories} Calories</em>
     <a href="#" class="secondary-content"><i class="edit-item fas fa-pencil-alt"></i></a>`;

      // Insert Item
      document.querySelector(UISelector.itemList).insertAdjacentElement('beforeend', li);
    },
    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelector.listItems);

      // Turn Node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function (listItem) {
        const itemID = listItem.getAttribute("id");

        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fas fa-pencil-alt"></i>
          </a>`;
        }
      });
    },
    deleteListItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    removeItems: function () {
      let listItems = document.querySelectorAll(UISelector.listItems);

      // Turn into array
      listItems = Array.from(listItems);

      listItems.forEach(function (item) {
        item.remove();
      });
    },
    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelector.totalCalories).textContent = totalCalories;
    }
  }
})();

// App Controller
const App = (function (ItemCtrl, UICtrl) {
  // Load event listners 
  const loadEventListners = function () {

    // Get UI selectors
    const UISelector = UICtrl.getSelectors();

    // Add item event 
    document.querySelector(UISelector.addBtn).addEventListener('click', itemAddSubmit);

    // Disable submit enter
    document.addEventListener('keypress', (e) => {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // Edit click icon event
    document.querySelector(UISelector.itemList).addEventListener('click', itemEditClick);

    // Update item event 
    document.querySelector(UISelector.updateBtn).addEventListener('click', itemUpdateSubmit);

    // Back item event 
    document.querySelector(UISelector.backBtn).addEventListener('click', UICtrl.clearEditState);

    // Delete item event 
    document.querySelector(UISelector.deleteBtn).addEventListener('click', itemDeleteSubmit);

    // Clear item event 
    document.querySelector(UISelector.clearBtn).addEventListener('click', clearAllItemsClick);

  }

  // Add item Submit 
  const itemAddSubmit = function (e) {

    // Get form input from UICtrl
    const input = UICtrl.getItemInput();

    // Check for the input Exist
    if (input.name !== '' & input.calories !== '') {
      // Add Item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
    }

    // Add item to UI
    UICtrl.addListItem(newItem);

    // Get total Calories 
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total Calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Store in LocalStorage
    StorageCtrl.storeItem(newItem);

    // Clear Input
    UICtrl.clearInput();

    e.preventDefault();
  }

  // Edit item click 
  const itemEditClick = function (e) {
    // add event dilegator for the edit icon
    if (e.target.classList.contains('edit-item')) {
      // get list item id
      const listId = e.target.parentNode.parentNode.id;

      // break into an array
      const listIdArr = listId.split('-');

      // get the actual id
      const id = parseInt(listIdArr[1]);

      // Get the item
      const itemToEdit = ItemCtrl.getItemById(id);

      // set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      UICtrl.addItemToform();
    }

    e.preventDefault();
  }

  // Update item submit
  const itemUpdateSubmit = function (e) {
    // Get item input
    const input = UICtrl.getItemInput();

    // Update item 
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update UI
    UICtrl.updateListItem(updatedItem);

    // Get total Calories 
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total Calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Update LS
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();

    e.preventDefault();
  }

  // Delete item submit 
  const itemDeleteSubmit = function (e) {
    // Get Current Item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete current item
    ItemCtrl.deleteItem(currentItem.id);

    // Delete item from UI
    UICtrl.deleteListItem(currentItem.id);

    // Get total Calories 
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total Calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Delete from LS
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();

    e.preventDefault();
  }

  const clearAllItemsClick = function () {
    // Delete All item from Data Structure
    ItemCtrl.clearAllItems();

    // Get total Calories 
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total Calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Remove form UI 
    UICtrl.removeItems();

    // Clear from LS
    StorageCtrl.clearItemsFromStorage();

    UICtrl.clearEditState();

    // Hide UI
    UICtrl.hideList();

  }

  // public Method
  return {
    init: function () {
      // clear edit state
      UICtrl.clearEditState();

      // fetch the data from the user and ItemCtrl
      const items = ItemCtrl.getItems();

      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // populate list Item
        UICtrl.populateListItem(items);
      }

      // Get total Calories 
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total Calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Load Event Listenrs 
      loadEventListners();


    }
  }
})(ItemCtrl, UICtrl);


// initillaize the application
App.init();