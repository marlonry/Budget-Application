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
        }
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
            html = `<div class="item clearfix" id="income-%id%">
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
            html = `<div class="item clearfix" id="expense-%id%">
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

        clearFields: function() {
            var fields, fieldsArray;

            // selects the elements from the DOMstrings object to 
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

            // fieldsArray = Array.from(fields);
            fieldsArray = Array.prototype.slice.call(fields);

            // runs over the array to clear the elements
            fieldsArray.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArray[0].focus();
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
    };

    var updateBudget = function() {
        // 1. Calculate the budget

        // 2. Return the budget

        // 3. Display the budget on the UI
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
            setupEventListeners();
        }
    }

})(budgetController, UIController)

controller.init();

