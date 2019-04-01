// Budget Controller
var budgetController = (function() {
    
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0,
        },
        budget: 0,
        percentage: -1,
    }

    // function is created to calculate the inc and exp by using only function which can be call later multiple times for different calculations in this case for income and expenses. 
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    }

    return {
        addItem: function(type, des, val) {
            var newItem, ID;

            // create new id 
            if(data.allItems[type].length > 0) {
                // Acesses the items --> then
                // type with parameters passed --> then
                // the index of the array by lenght of the type -1, the minus one its because the index needs to be accessed --> then 
                // ID will be zero first then after the new instance of the inc or exp are created it will be created dynamically and since it start at zero then 1 is added to it making it dynamic.
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1
            } else {
                ID = 0;
            }

            // create new item(instance of the constructor) based on 'inc' or 'exp' type
            if(type === "exp") {
                newItem = new Expense(ID, des, val);
            } else if(type === "inc") {
                newItem = new Income(ID, des, val);
            }

            // push it into our data structure
            data.allItems[type].push(newItem);

            // return the new element which is an object containing id, des and val
            return newItem;
        },

        deleteItem: function(type, id) {
            var ids, index;
            // id = 6
            // data.allItems[type][id]; ---> it cant be done like this because they Id wont always be organized in the same position as the indexes of the array 
            // ids = [1,2,4,6,8] ---> So it this case if we wanted to delete the item with id 6 it is stores on the third index of the array therefore accesing the ids by indexes wont work
            // index = 3

            // creates array of the ids
            ids = data.allItems[type].map(function(current) {
                return current.id 
            })

            // so now after getting the array of the ids we can find the index of the id that was passed as an argument so it they id was 4 the index of method will find that element, in this case 6 is on the third index. it is stored on the index variable.
            index = ids.indexOf(id);

            // indexof return -1 when the element doesnt exist in the array so then we create and if statement to check if we have an index if there is remove that element with the splice method for arrays which removes, inserts or replaces elements in the array.
            if(index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        // calculates all nessesary results and stores the calculations in the data structure for later usage
        calculateBudget: function() {
            // calculate totale income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of income that we spent
            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1; // non-existant
            }
        },

        getBudget: function() {
            // returns and object containning all the data from the data structure
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage,
            }
        },

        // testing methods to see the data structure
        testing: function() {
            console.log(data);
        } 
    };

})();


// UI Controller
var UIController = (function(){
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
    }
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
            };
        },

        addListItem: function(obj, type) {
            var html, newhtml;
            
            // Create HTML string with placeholder text
            if(type === "inc") {
            element = DOMstrings.incomeContainer;
            html = `<div class="item clearfix" id="inc-%id%">
                <div class="item__description">%description%</div>
                <div class="right clearfix">
                    <div class="item__value">%value%</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>
            </div>`
            } else if(type === "exp") {
            element = DOMstrings.expenseContainer;
            html = `<div class="item clearfix" id="exp-%id%">
                <div class="item__description">%description%</div>
                <div class="right clearfix">
                    <div class="item__value">%value%</div>
                    <div class="item__percentage">21%</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>
            </div>`
            }
            // Replace the placeholder text with some actual data
            newhtml = html.replace('%id%', obj.id);
            newhtml = newhtml.replace('%description%', obj.description);
            newhtml = newhtml.replace('%value%', obj.value);

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newhtml);
        },

        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearFields: function() {
            var fields, fieldsArray;

            // selects the elements from the DOMstrings object to 
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

            // fieldsArray = Array.from(fields); // Makes the list an array by using this trick with the slice method
            fieldsArray = Array.prototype.slice.call(fields);

            // runs over the array to clear the elements
            fieldsArray.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArray[0].focus();
        },

        displayBudget: function(obj) {
            // this accesses the html elements then sets the content to the object data
            // DOMstring gets the css class for each element
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
            
            // Adds the percentage only if the percentage is more than 0 this happens when the is only expenses in the data structure so it will set the percentage to infinity otherwise
            // else set element to this "---" 
            if(obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%";
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = "---";
            }
        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    }

})();

// Global App Controller
var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress',function(e) {
            if(e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }
        });

        // set up event listener to do event delegation --> selects parent element
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)
    };

    var updateBudget = function() {
        
        // 1. Calculate the budget 
        budgetCtrl.calculateBudget();

        // 2. Return the budget object from the get budget method which only shows an object
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    }

    // creates the function that will be call by the event listerner
    // we pass the event object to do event delegation and dom traversing
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;

        // event traversing although it is hard coded there should be a better way to get this to work
        // other way to do this would be to set up the id in the button itself and then from there find the parent node with the closest() method which specifies the class of the parent.
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        // coerce to true if it exist else coerce to false
        if(itemID) {

            // splitID is the id split in the - which will get you "inc" and "0" in an array
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // delete item from data structure
            budgetCtrl.deleteItem(type, ID);

            // delete item from ui // update the ui
            UICtrl.deleteListItem(itemID);

            // update and show the budget
            updateBudget();
        }
    }

    
    var ctrlAddItem = function() {
        var input, newItem, addItem
        // 1. Get the field input data(values) which comes from the html
        input = UICtrl.getInput();
        
        // Validates the input fields, if they are empty, if they are not a number and they need to be greater than 0
        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            // return instance of object depending on type either exp or inc
            newItem = budgetCtrl.addItem(input.type, input.description, input.value); 

            // 3. Add the item to the Ui  
            // passes the intance of the object and the type that were store in variables from the returning data of the methods above.
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the Fields
            UICtrl.clearFields();

            // 5. Calculate and Update budget
            updateBudget();
        }
    }

    return {
        init: function() {
            // we call the display budget with an empy object for the init function
            UICtrl.displayBudget(
                {
                    budget: 0,
                    totalInc: 0,
                    totalExp: 0,
                    percentage: -1,
                }
            );
            // sets up the evenlisteners
            setupEventListeners();
        }
    }

})(budgetController, UIController)

controller.init();

