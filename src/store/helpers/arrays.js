/**
 * Method of adding array item at specific index without mutations.
 * https://redux.js.org/recipes/structuring-reducers/immutable-update-patterns#inserting-and-removing-items-in-arrays
 */
export function insertItem(array, action) {
	const newArray = array.slice();
	newArray.splice(action.id, 0, action);
	return newArray;
}

/**
 * Method of deleting array item from specific index without mutations.
 * https://redux.js.org/recipes/structuring-reducers/immutable-update-patterns#inserting-and-removing-items-in-arrays
 */
export function removeItem(array, actionId) {
	const newArray = array.slice();
	newArray.splice(actionId, 1);
	return newArray;
}
