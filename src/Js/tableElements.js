import {
	addNotes,
	saveNotes,
	notesRender,
	UpdateNotesButtons,
} from './notes.js';
import {
	findDataItemById,
	summaryTableData,
	updateDataBySummaryTable,
} from './data.js';

const renderSelect = (currentCategory = null) => {
	const selectOptions = summaryTableData.map((item) => item.name);
	return (
		selectOptions.reduce(
			(acc, val) =>
				val == currentCategory
					? (acc += `<option value="${val}" selected>${val}</option>`)
					: (acc += `<option value="${val}">${val}</option>`),
			'<select name="select" id="category-input">'
		) + '</select>'
	);
};

const tableRow = (...args) => {
	const [title, created, category, content, date, status, id] = args;
	const selectString = renderSelect(category);
	let actionBtn =
		status == 'Active'
			? `<button class='edit-notes-btn form-btn' data-id='${id}'>
					<span class="iconify btn-icon" data-inline="false" data-icon="akar-icons:edit"></span>
				</button> 
				<button class='archive-notes-btn form-btn' data-id='${id}'>
					<span class="iconify btn-icon" data-inline="false" data-icon="ic:outline-archive"></span>
				</button>`
			: `<button class='unarchive-notes-btn form-btn' data-id='${id}'>
					<span class="iconify btn-icon" data-inline="false" data-icon="ic:outline-unarchive"></span>
				</button>`;
	return `
        <td>
			<div class="avatar">
				<span class="iconify avatar-icon" data-inline="false" data-icon="${addAvatarToRow(
					category
				)}"></span>
				${title}
			</div>
		</td>
        <td>${created}</td>
        <td>${category.length == 0 ? selectString : category}</td>
        <td>${content}</td>
        <td>${date}</td>
        <td>
            <div class='btn-container'>
                ${actionBtn}
                <button class='delete-Notes-btn form-btn' data-id='${id}'>
					<span class="iconify btn-icon" data-inline="false" data-icon="ant-design:delete-outlined"></span>
				</button>
            </div>
        </td>`;
};
const addAvatarToRow = (category) => {
	switch (category) {
		case 'Idea':
			return `carbon:idea`;
		case 'Random Thought':
			return `ph:user-gear-light`;
		case 'Task':
			return `ic:outline-task`;
		default:
			return;
	}
};

const addNewRowForm = (
	title = '',
	created = new Date().toLocaleDateString('en-GB'),
	category = '',
	content = ''
) => {
	return `
		<td><input type="text" id='title-input' value='${title}'/></td>
    	<td id='created-time'>${created}</td>
    	<td>${renderSelect(category)}</td>
    	<td><input type="text" id='content-input' value='${content}'/></td>
    	<td><input type="date" id='dates-input' value=''/></td>
    	<td>
        	<div class='btn-container'>
           		<button class='save-Notes-btn form-btn'>
				   <span class="iconify btn-icon" data-inline="false"  data-icon="ic:outline-save"></span>   
				</button>
            	<button class='cancel-Notes-btn form-btn'>
					<span class="iconify btn-icon" data-inline="false" data-icon="ic:baseline-cancel"></span>  
				</button>
        	</div>
   		</td>`;
};
const summaryTableRow = (name, active, archived) => {
	return `
		<td>
			<div class="avatar">
				<span class="iconify avatar-icon" data-inline="false" data-icon="${addAvatarToRow(
					name
				)}"></span>
				${name}
			</div>
		</td>
		<td>${active}</td>
		<td>${archived}</td>
	`;
};

const addElementToTable = (body, className, id, rootElementID) => {
	let newElement = document.createElement('tr');
	newElement.className = className;
	newElement.innerHTML = body;
	newElement.dataset.id = id;
	document.querySelector(rootElementID).appendChild(newElement);
};

const formButton = (saveFunc, cancelFunc) => {
	const cancelNotesBtn = document.querySelector('.cancel-Notes-btn');
	const saveNotesBtn = document.querySelector('.save-Notes-btn');
	saveNotesBtn.addEventListener('click', saveFunc);
	cancelNotesBtn.addEventListener('click', cancelFunc);
};

const hideAllElementInTable = (params) => {
	const elements = document.querySelectorAll(params);
	elements.forEach((element) => element.parentNode.removeChild(element));
};

const isHadeForms = (massage, callback) => {
	const createdElement = document.querySelector('.create-Notes-element');
	createdElement == null ? callback() : alert(massage);
};
const closeAddNotesForm = () => {
	const container = document.querySelector('.create-Notes-element');
	container.parentNode.removeChild(container);
};
const createTableForm = () => {
	isHadeForms(`You can't open second form`, () =>
		addElementToTable(
			addNewRowForm(),
			'create-Notes-element',
			'temp-id',
			'#notes-table-footer'
		)
	);
	formButton(addNotes, closeAddNotesForm);
};

function editNotesForm(index) {
	const rootTrElement = document.querySelector(
		`.list-item[data-id="${index}"]`
	);
	const selectedItem = findDataItemById(index);
	const { title, created, category, content } = selectedItem;
	isHadeForms(`You can't edit two items`, () =>
		addElementToTable(
			addNewRowForm(title, created, category, content),
			'create-Notes-element',
			'temp-id',
			'#notes-table-footer'
		)
	);
	rootTrElement.style.display = 'none';
	formButton(
		() => {
			saveNotes(rootTrElement, updateItem(selectedItem));
		},
		() => {
			rootTrElement.style.display = 'table-row';
			closeAddNotesForm();
		}
	);
}
const editDates = (selectedItem, newDateValue) => {
	const { created } = selectedItem;
	const newDateString = newDateValue.split('-').reverse().join('/');
	return newDateString.length == 0 ? '' : `${created}, ${newDateString}`;
};

const inputDefender = (inputValue) =>{
	return inputValue.replace(/<*\>/g, '');
}

const updateItem = (selectedItem) => {
	const dates = document.querySelector('#dates-input').value;
	selectedItem.title = inputDefender(document.querySelector('#title-input').value);
	selectedItem.category = document.querySelector('#category-input').value;
	selectedItem.content = inputDefender(document.querySelector('#content-input').value);
	selectedItem.date = editDates(selectedItem, dates);
	return selectedItem;
};

const UpdateStaticTableButtons = () => {
	const addNotesBtn = document.querySelector('#create-notes-btn');
	const archiveDataBtn = document.querySelector('#archive-btn');
	const activeDataByn = document.querySelector('#active-btn');
	addNotesBtn.addEventListener('click', createTableForm);
	archiveDataBtn.addEventListener('click', () => UpdateTables('Archived'));
	activeDataByn.addEventListener('click', () => UpdateTables());
};

function UpdateTables(sortParams = 'Active') {
	try {
		hideAllElementInTable('.list-item');
		renderSummaryTable();
		notesRender(sortParams);
		UpdateNotesButtons();
	} catch (e) {
		console.error(e);
	}
}

const renderSummaryTable = () => {
	hideAllElementInTable('.summary-list-item');
	updateDataBySummaryTable();
	summaryTableData.forEach(({ id, name, active, archived }) => {
		addElementToTable(
			summaryTableRow(name, active, archived),
			'summary-list-item',
			id,
			'#summary-table-body'
		);
	});
};

const LoadTables = () => {
	UpdateTables();
	UpdateStaticTableButtons();
};

export {
	tableRow,
	inputDefender,
	addNewRowForm,
	UpdateTables,
	addElementToTable,
	closeAddNotesForm,
	editDates,
	editNotesForm,
	renderSummaryTable,
	LoadTables,
};
