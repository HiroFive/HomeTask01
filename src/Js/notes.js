import {
	tableRow,
	addElementToTable,
	closeAddNotesForm,
	editNotesForm,
	UpdateTables,
	renderSummaryTable,
	editDates,
} from './tableElements.js';
import {
	SortDataByStatus,
	deleteDataById,
	updateDataRow,
	createNewDataItem,
	updateTableDataStatus,
} from './data.js';

const notesRender = (Status) => {
	const notesArray = SortDataByStatus(Status);
	notesArray.forEach((item) => {
		const { id, title, created, category, content, date } = item;
		addElementToTable(
			tableRow(title, created, category, content, date, Status, id),
			`list-item`,
			id,
			'#notes-table-body'
		);
	});
};

const addNotes = () => {
	const newNotes = createNewDataItem();
	addElementToTable(
		tableRow(
			newNotes.title,
			newNotes.created,
			newNotes.category,
			newNotes.content,
			newNotes.date
		),
		'list-item',
		newNotes.id,
		'#notes-table-body'
	);
	closeAddNotesForm();
	UpdateTables();
};

const deleteNotes = (id) => {
	const rootTrElement = document.querySelector(`.list-item[data-id="${id}"]`);
	deleteDataById(id);
	rootTrElement.parentNode.removeChild(rootTrElement);
	renderSummaryTable();
};

const saveNotes = (item, selectedItem) => {
	updateDataRow(selectedItem, item.dataset.id);
	closeAddNotesForm();
	UpdateTables();
};

const setNotesStatus = (id, newStatus) => {
	const rootTrElement = document.querySelector(`.list-item[data-id="${id}"]`);
	updateTableDataStatus(newStatus, id);
	rootTrElement.parentNode.removeChild(rootTrElement);
};
const UpdateNotesButtons = () => {
	const deleteNotesBtn = document.querySelectorAll('.delete-Notes-btn');
	const archivedNotesBtn = document.querySelectorAll('.archive-notes-btn');
	const editNotesBtn = document.querySelectorAll('.edit-notes-btn');
	const unArchiveNotesBtn = document.querySelectorAll('.unarchive-notes-btn');

	deleteNotesBtn.forEach((deleteBtn) => {
		deleteBtn.addEventListener('click', () =>
			deleteNotes(deleteBtn.dataset.id)
		);
	});

	archivedNotesBtn.forEach((archiveBtn) => {
		archiveBtn.addEventListener('click', (event) => {
			setNotesStatus(archiveBtn.dataset.id, 'Archived');
			renderSummaryTable();
		});
	});
	editNotesBtn.forEach((editBtn) => {
		editBtn.addEventListener('click', () => editNotesForm(editBtn.dataset.id));
	});
	unArchiveNotesBtn.forEach((unarchiveBtn) => {
		unarchiveBtn.addEventListener('click', () => {
			setNotesStatus(unarchiveBtn.dataset.id, 'Active');
			renderSummaryTable();
		});
	});
};

export {
	notesRender,
	saveNotes,
	deleteNotes,
	setNotesStatus,
	addNotes,
	UpdateNotesButtons,
};
