// BUDGET CONTROLLER --------------------------------------------------------------------------------------

const budgetController = (() => {

    class Income {
        constructor(id, description, value, percentage) {
            this.id = id;
            this.description = description;
            this.value = value;
            this.percentage = percentage;
        }
    };

    class Expense {
        constructor(id, description, value, percentage) {
            this.id = id;
            this.description = description;
            this.value = value;
            this.percentage = percentage;
        }

        calculatePerc() {
            this.percentage = Math.round((this.value / data.totals.exp) * 100);
        }
    };

    // data structure
    const data = {
        budget: 0,
        totals: {
            inc: 0,
            exp: 0,
        },
        type: {
            inc: [],
            exp: [],
        },
        percentage: -1,
    };
    // returning object making methods and things publicly accesible to other controllers 
    return {
        // adds item to data structure depending on the type with a unique ID
        addItem: (type, description, value) => {

            let ID, element;
            if(data.type[type].length > 0) {
                ID = data.type[type][data.type[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            if(type === "inc") {
                element = new Income(ID, description ,value)
            } else if (type === "exp") {
                element = new Expense(ID, description ,value)
            }

            data.type[type].push(element);

            return ID;
        },
        calculateBudget: () => {
            // sum of all the income and expenses
            let income = 0;
            data.type['inc'].forEach((current) => {
                income += current.value;
            });

            let expense = 0;
            data.type['exp'].forEach((current) => {
                expense += current.value;
            });

            data.totals.inc = income;
            data.totals.exp = expense;
    
            // calculate the budget income - expenses
            data.budget = income - expense;
            
            // percentage of the expenses
            if(data.totals.inc > 0) {
                data.percentage = (data.totals.exp / data.totals.inc) * 100;
            } else {
                data.percentage = -1;
            }
        },
        getCalculation: () => {
            return {
                budget: data.budget,
                inc: data.totals.inc,
                exp: data.totals.exp,
                percentage: data.percentage,
            }
        },
        calculatePercentages: () => {
            data.type.exp.forEach(cur => cur.calculatePerc());
        },
        getPercentages: () => {
            return data.type.exp.map(cur => cur.percentage);
        },
        deleteItem: (type, ID) => {
            const element = data.type[type].findIndex(cur => cur.id === ID)
            
            if(!(element === -1)) {
                data.type[type].splice(element, 1);
            }

            return element;
        },
        // resting method to see the data structure
        testing: () => {
            return data;
        }
    };
})();


// UI CONTROLLER --------------------------------------------------------------------------------------

const UIController = (() => {
    // gets dom strings
    const DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputAddButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        deleteButton: 'item__delete--btn',
        listItems: '.item',
    } 

    // returning object making methods and things publicly accesible to other controllers 
    return {
        getDOMStrings: () => DOMStrings,
        // gets the input value from the boxes in the ui and returns them as an object
        getValues: () => {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(Math.abs(document.querySelector(DOMStrings.inputValue).value)),
            }
        },
        // method to add item to the ui
        addItemtoUI: (type, ID, description, value) => {
            let html, element;

            if(type === "inc") {
                html = 
                `<div class="item clearfix" id="inc-${ID}">
                    <div class="item__description">${description}</div>
                    <div class="right clearfix">
                        <div class="item__value">${value}</div>
                        <div class="item__delete">
                            <button data-id="inc-${ID}" class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>`
                element = DOMStrings.incomeContainer;
            } else if (type === "exp") {
                html = 
                `<div class="item clearfix" id="exp-${ID}">
                    <div class="item__description">${description}</div>
                    <div class="right clearfix">
                        <div class="item__value">${value}</div>
                        <div class="item__percentage">10</div>
                        <div class="item__delete">
                            <button data-id="exp-${ID}" class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>`
                element = DOMStrings.expenseContainer;
            }

            document.querySelector(element).insertAdjacentHTML('beforeend', html);

        },
        showCalculations: (obj) => {
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.inc;
            document.querySelector(DOMStrings.expenseLabel).textContent = obj.exp;

            if(obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = `${obj.percentage}%`;
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = "---";
            }
        },
        deleteListItem(ID) {
            function forEachNodeList(list, callback) {
                for(let i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            }

            const listItems = document.querySelectorAll(DOMStrings.listItems);

            forEachNodeList(listItems, function(cur, i) {
                if(cur.id === ID) {
                    const el = cur;
                    el.parentNode.removeChild(el);
                };
            });
        },
        clearFields: () => {
            document.querySelector(DOMStrings.inputDescription).value = "";
            document.querySelector(DOMStrings.inputValue).value = "";
            document.querySelector(DOMStrings.inputDescription).focus();
        }
    };
})();


// MAIN CONTROLLER --------------------------------------------------------------------------------------


const controller = ((budgetCtrl, UICtrl) => {

    // gets the dom string classes from the css
    const DOM = UICtrl.getDOMStrings();

    // sets up event listeners 
    const setEventListener = () => {
        document.querySelector(DOM.inputAddButton).addEventListener('click', addItem);

        document.addEventListener('keypress', function(e) {
            if(e.keyCode === 13) {
                addItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', function(e) {
            if(e.target.parentNode.className === DOM.deleteButton) {
                deleteItem(e);
            }
        });
    };

    const calculateBudget = () => {
        // calculates the budget
        budgetCtrl.calculateBudget();

        // gets the values from the calculation above
        const values = budgetCtrl.getCalculation();

        // add calculation values to the ui
        UICtrl.showCalculations(values);
    };

    // adds item to the ui and data structure by calling the methods from those controllers
    const addItem = () => {
        const input = UICtrl.getValues();

        if((input.description !== "" && input.value !== "") && !(isNaN(input.value))) {
            // add item to data structure
            let ID = budgetCtrl.addItem(input.type, input.description, input.value);

            // add item to ui
            UICtrl.addItemtoUI(input.type, ID, input.description, input.value);

            // clear fields 
            UICtrl.clearFields();

            // calculate budget
            calculateBudget();
        }
    }

    const deleteItem = (e) => {

        const element = e.target.parentNode;
        const dataType = element.dataset;
        const [type, id] = dataType.id.split('-');

        // delete item from data structure
        budgetCtrl.deleteItem(type, parseInt(id));

        // delete item from ui
        UICtrl.deleteListItem(`${type}-${id}`);

        // recalculate the budgets
        calculateBudget();
    }

    // returns and object with one init method to initialize all the values and also all the event listeners
    return {
        init: () => {
            setEventListener();
            UICtrl.showCalculations({
                budget: 0,
                inc: 0,
                exp: 0,
                percentage: -1,
            });
        }
    }

})(budgetController, UIController);

// calls the initialization method
controller.init();