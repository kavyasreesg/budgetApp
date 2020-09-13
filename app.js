//Refer PDF at Video-77
//budgetManager (IIFE) hidden from other codes
//Module pattern returns all the pattern (object) that can be public.
//so only publicTest is only accessible from outside.
//Also publicTest can access because of closures since inner Function has access to outer function even though outer function variables and properties has returned.
var budgetController = (function () {
    var Expense = function (ID, desc, value) {
        this.ID = ID,
            this.desc = desc,
            this.value = value,
            this.percentage = -1;
    };
    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }
        else {
            this.percentage = -1;
        }
    };
    Expense.prototype.getPercentage = function () {

        return this.percentage;
    };

    var Income = function (ID, desc, value) {
        this.ID = ID,
            this.desc = desc,
            this.value = value
    };
    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum = sum + cur.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },

        percentage: -1,
        budget: 0

    };
    return {
        addItem: function (type, desc, value) {
            var newItem, ID;
            // Creating unique ID each time the new Item is added
            if (data.allItems[type].length === 0) {
                ID = 0;
            }
            else {
                ID = data.allItems[type][data.allItems[type].length - 1].ID + 1;
            }
            //Creating newItem based on type
            if (type === "inc") {
                newItem = new Income(ID, desc, value);
            }
            else if (type === "exp") {
                newItem = new Expense(ID, desc, value);
            }
            //Adding item created to data
            data.allItems[type].push(newItem);
            return newItem;
        },

        deleteItem: function (type, ID) {
            var ids = data.allItems[type].map(function (curent) {
                return curent.ID;
            });
            index = ids.indexOf(ID);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }

        },

        calculateBudget: function () {
            //Calculate total Income and Expenses.
            calculateTotal('exp');
            calculateTotal('inc');
            //Total budget = Income - Expenses
            data.budget = data.totals['inc'] - data.totals['exp'];
            //Calculate percentage of budget
            if (data.totals['inc'] > 0) {
                data.percentage = Math.round((data.totals['exp'] / data.totals['inc']) * 100);
            }
            else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function () {
            //totalIncome: 2000, a=10(exp-1)so % will be 0.5%
            data.allItems['exp'].forEach(function (curr) {
                curr.calcPercentage(data.totals['inc']);
            })
        },

        getPercentages: function () {
            var allPerc = data.allItems['exp'].map(function (curr) {
                return curr.getPercentage();
            });
            return allPerc;
        },

        budgetReturn: function () {
            return {
                budget: data.budget,
                percentage: data.percentage,
                totalInc: data.totals['inc'],
                totalExp: data.totals['exp']
            }
        }
    }
})();

var UIController = (function () {
    var DOMStrings = {
        input_type: ".add__type",
        input_desc: ".add__description",
        input_value: ".add__value",
        inp_btn: ".add__btn",
        incomeContainer: ".income__list",
        expenseContainer: ".expenses__list",
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expenseLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        container: ".container",
        itemPercentages: '.item__percentage',
        month: '.budget__title--month'

    };
    var formatNumber = function (num, type) {
        var numSplit, int, dec;
        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');
        int = numSplit[0];
        dec = numSplit[1];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
        }
        return (type === 'inc' ? '+' : '-') + ' ' + int + '.' + dec;

    };
    var nodeListForEach = function (list, callback) {

        for (var i = 0; i < list.length; i++) {

            callback(list[i], i);

        }

    };


    return {//public
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.input_type).value, // will be either inc or exp
                description: document.querySelector(DOMStrings.input_desc).value,
                value: parseFloat(document.querySelector(DOMStrings.input_value).value)
            }
        },

        addListItem: function (obj, type) {

            //Create HTML strings with Placeholder text
            var html, element;

            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if (type === 'exp') {
                element = DOMStrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //Replace placeholder text with actual data (Obj)            
            newHtml = html.replace('%id%', obj.ID);
            newHtml = newHtml.replace("%description%", obj.desc);
            newHtml = newHtml.replace("%value%", formatNumber(obj.value));

            //Insert HTML into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);// Inserted as child of income__list/expenses__list
        },

        deleteListItem: function (selectorID) {
            var element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);
        },

        getDOMStrings: function () {
            return DOMStrings;
        },

        clearFields: function () {
            var fields;
            fields = document.querySelectorAll(DOMStrings.input_desc + ',' + DOMStrings.input_value); //Selecting mutliple selectors by inserting ","
            fieldsArray = Array.prototype.slice.call(fields);
            fieldsArray.forEach(function (curr, i, array) {
                curr.value = "";
            });// sets all the values of fieldsArray to ""
            fieldsArray[0].focus();//after clearing places the cursor(focus) on Add Description field
        },

        displayBudget: function (obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');

            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + "%";
            }
            else {
                document.querySelector(DOMStrings.percentageLabel).textContent = "---";
            }
        },
        displayPercentages: function (percentages) {
            var fields = document.querySelectorAll(DOMStrings.itemPercentages);//returns Node List


            nodeListForEach(fields, function (curr, index) {
                if (percentages[index] > 0) {

                    curr.textContent = percentages[index] + "%";
                }
                else {
                    curr.textContent = "---";
                }

            });

        },
        displayMonth: function () {
            var now, day, year, month, months;
            months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            now = new Date();
            day = now.getDate();
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMStrings.month).textContent = day + "th " + months[month] + " " + year;

        },
        changedType: function () {
            var fields = document.querySelectorAll(
                DOMStrings.input_type + ',' + DOMStrings.input_desc + ',' + DOMStrings.input_value
            );
            nodeListForEach(fields, function (curr) {
                curr.classList.toggle('red-focus');
            });
            document.querySelector(DOMStrings.inp_btn).classList.toggle('red');
        }
    }
})();

var appController = (function (budgetCtrl, UICtrl) {
    var eventListerners = function () {
        var DOM = UICtrl.getDOMStrings();
        //When the button is clicked or key press event (i.e., on pressing enter)

        document.querySelector(DOM.inp_btn).addEventListener('click', function () {
            controlAddItem();
        });
        //keycode is specific to each key on the keyboard.
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13) {
                controlAddItem();
            }
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);// Add event delegation
        document.querySelector(DOM.input_type).addEventListener('change', UICtrl.changedType);
    }

    var updateBudget = function () {
        var budget;

        //1.Calculate the Budget
        budgetCtrl.calculateBudget();

        //2. Return the Budget       
        budget = budgetCtrl.budgetReturn();

        //3.Display the budget on the UI
        UICtrl.displayBudget(budget);

    };
    var updatePercentages = function () {
        //1. Calculate Percentages
        budgetCtrl.calculatePercentages();

        //2. Read Percentages from Budget controller
        var percentages = budgetCtrl.getPercentages();

        //3. Update Percentages to UI
        UICtrl.displayPercentages(percentages);
    };

    var controlAddItem = function () {
        //Get the Input data
        var input = UICtrl.getInput();

        if (input.description !== '' && !(isNaN(input.value)) && (input.value > 0)) {
            // add item to budget controller
            var newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // add the same item to UI as well
            UICtrl.addListItem(newItem, input.type);

            //Clearing Input fields
            UICtrl.clearFields();

            //calculate budget and display budget
            updateBudget();

            //Calculate and Update percentages
            updatePercentages();
        }
    };

    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, ID;
        //To move to the parent node's id of deleting item
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //1. delete the item from data structure
            budgetCtrl.deleteItem(type, ID);

            //2. delete item from UI
            UICtrl.deleteListItem(itemID);

            //calculate budget and display budget
            updateBudget();

            //Calculate and Update percentages
            updatePercentages();
        }


    };

    return {
        init: function () {
            eventListerners();
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                percentage: -1,
                totalInc: 0,
                totalExp: 0
            })
        }
    }




})(budgetController, UIController);

appController.init();