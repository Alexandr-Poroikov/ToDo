// ========== FILTER /  search ==========
const filter = function(){
	const inputFilter = document.querySelector('.js-inp');
	const items = document.querySelectorAll('.js-list > li');
	//filter elements
	inputFilter.addEventListener('keyup', textInput);

	//filter elements
	function textInput(){
		let str = inputFilter.value.toLowerCase();
		items.forEach((item)=>{
			if(item.innerHTML.toLowerCase().includes(str)){
				item.style.display = '';
			}else{
				item.style.display = 'none'
			}
		})
	}
}
filter();

// ========== PHOTO ==========
function photo(){
	let input = document.querySelector('.js-url');
	let container = document.querySelector('.js-listPhoto');
	let textForInput = document.querySelector('.js-text');
	// array for local Storage
	let arrayLS = [];

	// show text "please enter"
	input.addEventListener('keyup',showText);

	// get Local Storage
	getLocalStorage();
	// create data and save to local storage
	input.addEventListener('keyup', saveData);
	// delete on click
	container.addEventListener('click', deleteItem);


	// create data and save to local storage
	function saveData(event){
		if(event.key == 'Enter' && input.value != ''){
			// create data and save to array
			let dataLS = {
				src : input.value,
			}
			arrayLS.push(dataLS);
			//	add this data on the page
			createEls();
            // hide "please enter"
            textForInput.classList.remove('js-visible');
			// save data in local Storage
			localStorage.setItem('gallery', JSON.stringify(arrayLS));
			// clear input
			input.value = '';
		}
	}

	// add data on the page
	function createEls(){
		if(arrayLS.length === 0) container.innerHTML='';
		let li = '';
		// create and add
		arrayLS.forEach((item,index)=>{
			li += `<li class="photo__item js__item"><img src="${item.src}" alt="photo"></li>`;
			container.innerHTML = li;
		})
	}

	// get Local Storage
	function getLocalStorage(){
		if(!!localStorage.getItem('gallery')){
			let getLocStorage = JSON.parse(localStorage.getItem('gallery'));
			// rewrite values
			arrayLS = getLocStorage;
			// add data on the page
			createEls()
		}
	}

	// delete on click
	function deleteItem(e){
		let itemSrc = e.target.getAttribute('src');
		arrayLS.forEach((item,index)=>{
			if(item.src === itemSrc){
				arrayLS.splice(index, 1);
				// displayed on the page
				createEls();
				// displayed on the local Storage(save data)
				localStorage.setItem('gallery',JSON.stringify(arrayLS));
			}
		})
	}

	// show "please enter"
	function showText(){
		if(input.value !== ''){
			textForInput.classList.add('js-visible');
		}else{
			textForInput.classList.remove('js-visible');
		}
	}
}
photo();

// ========== WIDGET CLICK ===========
const counterClick = ()=>{
	const count = document.querySelector('.js-counter');
	const widgetClick = document.querySelector('.js-click');
	const button = document.querySelector('.js-but');
	
	//get localStorage
	getLocalStorageCounter();
	//add count
	widgetClick.addEventListener('click', blockClick);
	// clear Local Storage on click
	button.addEventListener('click', clearLS);

	//add count
	function blockClick(){
		let valueEl = parseInt(count.innerHTML);
		valueEl++;
		//append result in HTML
		count.innerHTML = valueEl;

		// localStorage.removeItem('clickCount')
		localStorage.setItem('clickCount', JSON.stringify(valueEl))
	}

	//get localStorage
	function getLocalStorageCounter(){
		let savedValue = localStorage.getItem('clickCount');
		if(!!savedValue){
			count.innerHTML = savedValue;
		}else{
			count.innerHTML = 0;
		}
	}

	// clear LocalStorage 
	function clearLS(){
		localStorage.removeItem('clickCount');
		count.innerHTML = 0;
	}

}
counterClick();

// ========== TO DO ===========
const todo = function(){

	const inputTodo = document.querySelector('.js-input');
	const buttonTodo = document.querySelector('.js-button');
	const containerTodo = document.querySelector('.js-container');
	// array for local Storage
	let todoList = [];

	// when loading, get local storage
	getLocalStorageTodo();
	// save code in local Storage
	buttonTodo.addEventListener('click', saveCode);
	//Delete Element on click
	containerTodo.addEventListener('click',deleteElement);


	// create data and save to local storage
	function saveCode(){
		// check for "empty"
		if(!inputTodo.value) return;

		// create data and save to array
		let newTodo = {
			todo: inputTodo.value,
			checked: false,
		}
		todoList.push(newTodo);
		//add this data on the page
		displayMessages();
		// delete Element when adding
		deleteElement();
		// save in local storage
		localStorage.setItem('todo', JSON.stringify(todoList));
		// cleare input
		inputTodo.value = '';
	}

	// add data on the page
	function displayMessages(){
		//check for "last removed item"
		if(todoList.length === 0) containerTodo.innerHTML = '';

		let tagLI = '';
		// running the local storage
		todoList.forEach((item,index)=>{ 
		//create tags
			tagLI += `
			<li class="todo__item">
				<input type="checkbox" class="todo__checkbox" id="check${index}"${item.checked? 'checked': ''}>
				<label for="check${index}" class="todo__label">${item.todo}</label>
				<button class="todo__but">X</button>
			</li>`
		//add tags to HTML
			containerTodo.innerHTML = tagLI;
		})
	}

	//get localStorage
	function getLocalStorageTodo(){
		if(!!localStorage.getItem('todo')){
			let getLlocSt = JSON.parse(localStorage.getItem('todo'));
			// rewrite values
			todoList = getLlocSt;
			// add this data on the page
			displayMessages();
			// delete Element on page load
			deleteElement();

		}
	}

	// чтобы отслеживать НАЖАТУЮ ГАЛОЧКУ ,нам нужно отследить инпуты по ID = найти LABEL с таким же
	// FOR(чтобы сравнить с данными в Локал Ст.) => изменить его ЧЕКЕД в нашем объекте.

	// Теперь ,чтобы все LI не перебирать, мы повесим событие на UL (их родителя)
	containerTodo.addEventListener('change', function(event){
		// watching the event
		let inpID = event.target.getAttribute('id');
		// item search 
		let labelFor = containerTodo.querySelector(`[for="${inpID}"]`);
		let labelValue = labelFor.innerHTML;

		// compare
		todoList.forEach(function(item){
			// we find the required 'data block' in the array
			if(item.todo === labelValue){
			// change
				item.checked = !item.checked;
			// save data 
				localStorage.setItem('todo', JSON.stringify(todoList));
			}
		})		
	})

	//Delete Element on click
	function deleteElement(){
		let butItems = containerTodo.querySelectorAll('.todo__but');
		// catch the click on the button
		butItems.forEach((item)=>{
			item.addEventListener('click', function(e){	
				// find element in local Storage  AND  remove this el. in array
				let labelV = e.target.parentNode.querySelector('label').innerHTML;
				todoList.forEach(function(item,index){
					if(item.todo === labelV && item.checked){
						todoList.splice(index,1);
						// out to page HTML
						displayMessages();
						// save data 
						localStorage.setItem('todo', JSON.stringify(todoList));
					}
				})

			})
		})
	}

}
todo();

