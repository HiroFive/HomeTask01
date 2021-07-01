import {inputDefender} from './tableElements.js'

const tableData = [
	{
		id: 1,
		title: 'Some title1',
		created: new Date().toLocaleDateString('en-GB'),
		category: 'Idea',
		content: 'some content',
		date: '08/04/2021, 13/04/2021',
		status: 'Archived',
	},
	{
		id: 2,
		title: 'Some title2',
		created: new Date().toLocaleDateString('en-GB'),
		category: 'Idea',
		content: 'some content2',
		date: '',
		status: 'Active',
	},
	{
		id: 3,
		title: 'Some title3',
		created: new Date(2021, 4, 6).toLocaleDateString('en-GB'),
		category: 'Task',
		content: 'some content3',
		date: '',
		status: 'Active',
	},
	{
		id: 4,
		title: 'Some title4',
		created: new Date(2020, 2, 5).toLocaleDateString('en-GB'),
		category: 'Random Thought',
		content: 'some content4',
		date: '05/03/2020, 06/03/2021',
		status: 'Active',
	},
	{
		id: 5,
		title: 'Some title5',
		created: new Date(2021, 2, 5).toLocaleDateString('en-GB'),
		category: 'Random Thought',
		content: 'some content5',
		date: '',
		status: 'Active',
	},
	{
		id: 6,
		title: 'Some title6',
		created: new Date(2021, 4, 17).toLocaleDateString('en-GB'),
		category: 'Task',
		content: 'some content6',
		date: '',
		status: 'Archived',
	},
	{
		id: 7,
		title: 'Some title7',
		created: new Date(2021, 2, 15).toLocaleDateString('en-GB'),
		category: 'Task',
		content: 'some content7',
		date: '07/08/2020, 07/09/2020',
		status: 'Archived',
	},
];

const summaryTableData = [
	{
		id: 1,
		name: 'Task',
		active: 0,
		archived: 0,
	},
	{
		id: 2,
		name: 'Random Thought',
		active: 0,
		archived: 0,
	},
	{
		id: 3,
		name: 'Idea',
		active: 0,
		archived: 0,
	},
];

export default tableData;

const updateTableDataStatus = (newStatus, ElementId) => {
	tableData.forEach((item) => {
		if (item.id == ElementId) {
			item.status = newStatus;
		}
	});
};

const updateDataRow = (newData, ElementId) => {
	tableData.forEach((item) => {
		if (item.id == ElementId) {
			return newData;
		}
	});
};

const deleteDataById = (ElementId) => {
	tableData.splice(
		tableData.findIndex((item) => {
			return item.id == ElementId;
		}),
		1
	);
};
const createNewDataItem = () => {
	const newItem = {
		id: tableData.length + 1,
		title: inputDefender(document.querySelector('#title-input').value),
		created: document.querySelector('#created-time').innerHTML,
		category: document.querySelector('#category-input').value,
		content: inputDefender(document.querySelector('#content-input').value),
		date: new Date(document.querySelector('#dates-input').value).toLocaleDateString('en-GB'),
		status: 'Active',
	};
	tableData.push(newItem);
	return newItem;
};

const findDataItemById = (params) => {
	for (const item of tableData) {
		if (item.id == params) {
			return item;
		}
	}
};

const SortDataByStatus = (Status) => {
	return tableData.filter((item) => item.status === Status);
};

const updateDataBySummaryTable = () => {
	summaryTableData.forEach((summaryItem) => {
		summaryItem.active = 0;
		summaryItem.archived = 0;
		tableData.forEach((item) => {
			if (item.category === summaryItem.name) {
				item.status === 'Active' ? summaryItem.active++ : summaryItem.archived++;
			}
		});
	});
};

export {
	updateTableDataStatus,
	deleteDataById,
	updateDataRow,
	updateDataBySummaryTable,
	createNewDataItem,
	findDataItemById,
	summaryTableData,
	SortDataByStatus,
};
