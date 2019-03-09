// Storage Controller
const StorageCtrl = (() => {
  // Public methods
  return {
    clearStorageItem() {
      localStorage.removeItem('items')
    },
    deleteFromStorage(id) {
      let items = JSON.parse(localStorage.getItem('items'))
      items.forEach((item, index) => {
        if (id === item.id) {
          items.splice(index, 1)
        }
      })
      localStorage.setItem('items', JSON.stringify(items))
    },
    getItemFromStorage() {
      let items;
      if (!localStorage.getItem('items')) {
        items = []
      }
      else {
        items = JSON.parse(localStorage.getItem('items'))
      }

      return items
    },
    storeItem(item) {
      let items;
      if (!localStorage.getItem('items')) {
        items = []
        items.push(item)
        localStorage.setItem('items', JSON.stringify(items))
      }
      else {
        items = JSON.parse(localStorage.getItem('items'))
        items.push(item)
        localStorage.setItem('items', JSON.stringify(items))
      }
    },
    updateStorageItem(updatedItem) {
      let items = JSON.parse(localStorage.getItem('items'))
      items.forEach((item, index) => {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem)
        }
      })
      localStorage.setItem('items', JSON.stringify(items))
    },
  }
})()

// Item Controller
const ItemCtrl = (() => {
  // Constructor
  const Item = function(id, name, calories) {
    this.id = id
    this.name = name
    this.calories = calories
  }

  // State - data structure
  const state = {
    items: StorageCtrl.getItemFromStorage(),
    currentItem: null,
    totalCalories: 0,
  }

  // Public methods
  return {
    logData() { return state },
    addItem(name, calories) {
      let id;
      // Create Id
      state.items.length > 0
        ? id = state.items[state.items.length - 1].id + 1
        : id = 0

      // Calories to number
      calories = parseInt(calories)

      // Create item
      let newItem = new Item(id, name, calories)
      state.items.push(newItem)

      return newItem

    },
    clearItems() {
      state.items = []
    },
    deleteItem(id) {
      // Get ids
      const allIds = state.items.map(item => item.id)
      const index = allIds.indexOf(id)
      if (index > -1) {
        state.items.splice(index, 1)
      }
    },
    getCurrentItem() {
      return state.currentItem
    },
    getItems() { return state.items },
    getItemById(id) {
      return state.items.find(item => item.id === id)
    },
    getTotalCalories() {
     let totalCalories = state.items.reduce((sum, value) => sum + value.calories, 0)
     state.totalCalories = totalCalories

     return state.totalCalories
    },
    setCurrentItem(item) {
      state.currentItem = item
    },
    updateItem(name, calories) {
      calories = parseInt(calories)

      let found = null

      state.items.forEach(item => {
        if (item.id === state.currentItem.id) {
          item.name = name
          item.calories = calories
          found = item
        }
      })

      return found
    }
  }
})()

// UI Controller
const UICtrl = (() => {
  const UISelectors = {
    addBtn: '.add-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    collectionItem: '.collection-item',
    deleteBtn: '.delete-btn',
    itemCalories: '#item-calories',
    itemList: '#item-list',
    itemName: '#item-name',
    totalCalories: '.total-calories',
    updateBtn: '.update-btn',
  }

  return {
    addListItem(item) {
      // Show show list
      UICtrl.displayList(false)

      // Create list item
      const li = document.createElement('li')
      li.classList.add('collection-item')
      li.id = `item-${item.id}`
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>`

      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
    },
    clearEditState() {
      UICtrl.resetInputs()
      document.querySelector(UISelectors.addBtn).classList.remove('btn--hidden')
      document.querySelector(UISelectors.deleteBtn).classList.add('btn--hidden')
      document.querySelector(UISelectors.backBtn).classList.add('btn--hidden')
      document.querySelector(UISelectors.updateBtn).classList.add('btn--hidden')
    },
    removeItems() {
      document.querySelector(UISelectors.itemList).innerHTML = ''
      UICtrl.displayList()
    },
    deleteListItem(id) {
      document.querySelector(`#item-${id}`).remove()
    },
    displayList(flag = true) {
      flag
        ? document.querySelector(UISelectors.itemList).classList.add('item-list--hidden')
        : document.querySelector(UISelectors.itemList).classList.remove('item-list--hidden')
    },
    getItemInput() {
      return {
        name: document.querySelector(UISelectors.itemName).value,
        calories: document.querySelector(UISelectors.itemCalories).value,
      }
    },
    getSelectors() { return UISelectors },
    populateEditForm() {
      document.querySelector(UISelectors.itemName).value = ItemCtrl.getCurrentItem().name
      document.querySelector(UISelectors.itemCalories).value = ItemCtrl.getCurrentItem().calories
      UICtrl.showEditState()
    },
    populateItemList(items) {
      let html = ''

      items.forEach(item => {
        html += `<li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
        </li>`
      })

      document.querySelector(UISelectors.itemList).innerHTML = html
    },
    resetInputs() {
      document.querySelector(UISelectors.itemName).value = ''
      document.querySelector(UISelectors.itemCalories).value = ''
    },
    showEditState() {
      document.querySelector(UISelectors.addBtn).classList.add('btn--hidden')
      document.querySelector(UISelectors.deleteBtn).classList.remove('btn--hidden')
      document.querySelector(UISelectors.backBtn).classList.remove('btn--hidden')
      document.querySelector(UISelectors.updateBtn).classList.remove('btn--hidden')
    },
    showTotalCalories(totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories
    },
    updateItemList(item) {
      let listItems = document.querySelectorAll(UISelectors.collectionItem)
      listItems = Array.from(listItems)
      listItems.forEach(listItem => {
        const itemId = listItem.getAttribute('id')

        if (itemId === `item-${item.id}`) {
          document.querySelector(`#${itemId}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`
        }
      })
    },
  }
})()

// App Controller
const App = ((ItemCtrl, UICtrl, StorageCtrl) => {
  // Load event listeners
  const loadEventListeners = () => {
    const UISelectors = UICtrl.getSelectors()

    // Disable enter
    document.addEventListener('keypress', preventEnterSubmitHandler)

    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmitHandler)

    // Back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', backHandler)

    // Clear button event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllHandler)

    // Delete event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmitHandler)

    // Edit item event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditHandler)

    // Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateHandler)
  }

  const preventEnterSubmitHandler = e => {
    if (e.keyCode === 13 || e.which === 13) {
      e.preventDefault()
      return false
    }
  }

  const itemAddSubmitHandler = e => {
    e.preventDefault()
    // Get form input from UI Controller
    const input = UICtrl.getItemInput()

    // Check for name and calories
    if (input.name && input.calories) {
      // Add Item
      const newItem = ItemCtrl.addItem(input.name, input.calories)
      UICtrl.addListItem(newItem)
      input.name = ''
      input.calories = ''

      // Get total calories and show count
      const totalCalories = ItemCtrl.getTotalCalories()
      UICtrl.showTotalCalories(totalCalories)

      // Add to localStorage
      StorageCtrl.storeItem(newItem)

      // Clear inputs
      UICtrl.resetInputs()
    }
  }

  const backHandler = e => {
    e.preventDefault()
    UICtrl.clearEditState()
  }

  const clearAllHandler = e => {
    e.preventDefault()
    // Clear all items from state
    ItemCtrl.clearItems()

    // Get total calories and show count
    const totalCalories = ItemCtrl.getTotalCalories()
    UICtrl.showTotalCalories(totalCalories)

    // Remove list items
    UICtrl.removeItems()

    // Remove all items from localStorage
    StorageCtrl.clearStorageItem()
  }

  const itemDeleteSubmitHandler = e => {
    e.preventDefault()
    // Get ID from currentItem
    const currentItem = ItemCtrl.getCurrentItem()

    // Delete item from state
    ItemCtrl.deleteItem(currentItem.id)

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id)

    // Get total calories and show count
    const totalCalories = ItemCtrl.getTotalCalories()
    UICtrl.showTotalCalories(totalCalories)

    // Delete from localStorage
    StorageCtrl.deleteFromStorage(currentItem.id)

    UICtrl.clearEditState()
  }

  const itemEditHandler = e => {
    e.preventDefault()

    if (e.target.classList.contains('edit-item')) {
      // Get list item id
      const listId = e.target.closest('li').id
      const listIdArray = listId.split('-')
      const id = parseInt(listIdArray[1])

      // Set state - currentItem
      const itemToEdit = ItemCtrl.getItemById(id)
      ItemCtrl.setCurrentItem(itemToEdit)

      // Add item to form
      UICtrl.populateEditForm()
    }
  }

  const itemUpdateHandler = e => {
    e.preventDefault()
    // Get item input
    const input = UICtrl.getItemInput()
    // Add item to form
    const updateItem = ItemCtrl.updateItem(input.name, input.calories)

    // Update UI
    UICtrl.updateItemList(updateItem)

    // Get total calories and show count
    const totalCalories = ItemCtrl.getTotalCalories()
    UICtrl.showTotalCalories(totalCalories)

    // Update localStorage
    StorageCtrl.updateStorageItem(updateItem)

    UICtrl.clearEditState()
  }

  // Public methods
  return {
    init() {
      // Set initial button state
      UICtrl.clearEditState()

      // Fetch items from state
      const items = ItemCtrl.getItems()

      // Check if any items - hide list || Populate list with items
      items.length === 0
        ? UICtrl.displayList()
        : UICtrl.populateItemList(items)

      // Get total calories and show count
      const totalCalories = ItemCtrl.getTotalCalories()
      UICtrl.showTotalCalories(totalCalories)

      // Load eventlisteners
      loadEventListeners()
    }
  }
})(ItemCtrl, UICtrl, StorageCtrl)

// Initialize App
App.init()