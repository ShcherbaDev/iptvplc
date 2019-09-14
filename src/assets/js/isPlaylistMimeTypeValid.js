export default function isPlaylistMimeTypeValid(mimeType) {
	const checkMimeTypeRexExp = new RegExp(`^(${playlist_acceptable_mime_types.join('|')})$`);
	return checkMimeTypeRexExp.test(mimeType);
}
