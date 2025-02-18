import axios from 'axios';

export const getTask= async () => {
	const res = await axios.get('https://jsonplaceholder.typicode.com/todos');
	return res;
};