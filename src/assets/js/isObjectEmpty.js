export default function isObjectEmpty(obj) {
	return Object.entries(obj).length === 0 || obj === Object;
}
