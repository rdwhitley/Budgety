// BUDGET CONTROLLER
var budgetController = (function() {

	var Expense = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	}

	var Income = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	}

	var calculateTotal = function (type) {
		var sum = 0;

		data.allItems[type].forEach(function (item) {
			sum += item.value;
		});
		data.totals[type] = sum;
		
	}

	Expense.prototype.calcPercentage = function(totalIncome) {

		if (totalIncome > 0) {
			this.percentage = Math.round((this.value / totalIncome) * 100)
		} else {
			this.percentage = -1;
		}
	};

	Expense.prototype.getPercentage = function(totalIncome) {
		return this.percentage;
	}

	var data = {
		allItems: {
			expense: [],
			income: []
		},
		totals: {
			expense: 0,
			income: 0
		},
		budget: 0, 
		percentage: -1
	}

	return {
		addItem: function(type,des,val) {
			var newItem, ID;
			//Create New ID
			 if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
           
			

			//Create New Item
			if(type === 'expense') {
				newItem = new Expense(ID, des, val)
			} else if (type === 'income') {
				newItem = new Income(ID, des, val)
			}

			// Add to our data Structure
			data.allItems[type].push(newItem)

			//return new element
			return newItem;
		},

		testing: function() {
			console.log(data);
		},

		calculateBudget: function() {

			//Calculate total income and expenses
			calculateTotal('expense');
			calculateTotal('income');

			//Calculate Budget: income - expenses
			data.budget = (data.totals.income - data.totals.expense);


			//Calculate percentage of spent income
		if (data.totals.income > 0) {	
			data.percentage = Math.round(data.totals.expense / data.totals.income * 100);
		} else {
			data.percentage = -1;
		}	

		},


		calculatePercentage: function() {

			data.allItems.expense.forEach(function(current) {

				current.calcPercentage(data.totals.income);
			})

		},

		getPercentage: function() {

			var allPercentages = data.allItems.expense.map(function(current) {
				return current.getPercentage();
			})
			return allPercentages;
		},

		getBudget: function () {
			return {
				budget: data.budget,
				totalInc: data.totals.income,
				totalExp: data.totals.expense,
				percentage: data.percentage
			};
		},

		deleteItem: function(type, id) {

			var ids, index;

			ids = data.allItems[type].map(function(current) {
				return current.id;
			});

			index = ids.indexOf(id)

			if (index !== -1) {
				data.allItems[type].splice(index, 1)
			}

			
		}
	}



})();
	




//UI CONTROLLER
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
		expenseLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container',
		expensesPercLabel: '.item__percentage',
		dateLabel: '.budget__title--month'
	};


	var formatNumber = function(num, type) {
			var sumSplit, int, dec;

			num = Math.abs(num);
			num = num.toFixed(2);

			numSplit = num.split('.')

			int = numSplit[0];
			if (int.length > 3) {
				console.log(int.substr(0, int.length - 3) )
				int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3 , 3);
			}

			dec = numSplit[1];

			return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

		};

	var nodeListForEach = function(list, callback) {
				for (var i = 0; i < list.length; i++) {
					callback(list[i], i)
				}
			};

	return {
		getinput: function () {

			return {
					type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
					description: document.querySelector(DOMstrings.inputDescription).value,
					value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
			};
		},

		getDOMstrings: function () {
			return DOMstrings;
		},

		addListItem: function (obj,type) {
			
			var html, newHTML, element;
			//Create HTML string with placeholder text
			if (type === 'income') {
			 element = DOMstrings.incomeContainer;
			 html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === 'expense') {
			 element = DOMstrings.expenseContainer;
			 html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}

			//Replace Placeholder text
			newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value));

			// Insert the HTML into DOM 
			
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

		},

		clearFields: function () {
			var fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

			var fieldsArray = Array.prototype.slice.call(fields);

			fieldsArray.forEach(function (current, index, array) {
				current.value = '';
			})

			fieldsArray[0].focus();

		},

		changedType: function() {

			var fields = document.querySelectorAll(
					DOMstrings.inputType + ',' +
					DOMstrings.inputDescription + ',' +
					DOMstrings.inputValue); 
				
			
			nodeListForEach(fields, function(cur) {

				cur.classList.toggle('red-focus');

			});
	

			document.querySelector(DOMstrings.inputButton).classList.toggle('red');		

		},

		displayBudget: function(obj) {

			var type;
			obj.budget > 0 ? type = 'inc' : type = 'exp'

			document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
			document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
			document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
			document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;

			if (obj.percentage > 0 ) {
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
			} else {
				document.querySelector(DOMstrings.percentageLabel).textContent = '---';
			}

		},

		displayMonth: function() {
			var now, year, month;
			var now = new Date();

			var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

			year = now.getFullYear();
			month =  now.getMonth();

			document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;

		},

		displayPercentage: function (percentage) {

			var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);


			nodeListForEach(fields, function(current, index) {

				if (percentage[index] > 0) {
					current.textContent = percentage[index] + '%';
				} else {
					current.textContent = '---';
				}
				
			});

		},

		deleteListItem: function (selectorID) {

			var element = document.getElementById(selectorID);

			element.parentNode.removeChild(element)

		}
	};

})();

//APP controller 
var controller = (function(budgetCtrl, UICtrl) {

	var setupEventListeners = function () {

		var  DOM = UICtrl.getDOMstrings();

		document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem)

		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)

		document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType)

		document.addEventListener('keypress', function(key) {
		
		if (key.keyCode === 13 || key.which === 13) {
			ctrlAddItem();
		}

		});

	};

	var ctrlDeleteItem = function (event) {

		var itemID,splitID;

		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

		if (itemID) {

			splitID = itemID.split('-');
			type = splitID[0];
			ID = parseInt(splitID[1]);

		

			

			//1. Delete item from data structure
			budgetCtrl.deleteItem(type, ID);
			//2. Delete item from UI
			UICtrl.deleteListItem(itemID);

			//3. Update and show new Budget 
			updateBudget();
		}

	}

	var updatePercentage = function() {

		//1. Calculate percentage
		budgetCtrl.calculatePercentage();
		//2. Read percentage from budget controller
		var percentages = budgetCtrl.getPercentage();
		//3. Update UI with new budget
		UICtrl.displayPercentage(percentages);

	}

	var updateBudget = function() {

		//1. Calculate Budget
			budgetCtrl.calculateBudget();
		//2. Return Budget
			var budget = budgetCtrl.getBudget();
		//5. Display Budget on UI
			UICtrl.displayBudget(budget)
	}

	var ctrlAddItem = function () {
		var input,  newItem;
		// 1. Get input data
		input = UIController.getinput();

		if (input.description !== '' && input.value > 0) {

		// 2. Add Item to budget controller
		newItem = budgetCtrl.addItem(input.type, input.description, input.value);
		// 3. Add new item to UI
		UICtrl.addListItem(newItem, input.type);

		//4. Clear Fields
		UICtrl.clearFields();
		

		// 5. Calculate and Display Budget on the UI
			updateBudget();

		// 6. Calculate and update percentage
			updatePercentage();	
		}

		

	};

	return {
		init: function () {
			console.log('app started');
			UICtrl.displayMonth();
			UICtrl.displayBudget(
				{
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			}
			);
			setupEventListeners();
		}
	};

})(budgetController,UIController);
controller.init();



