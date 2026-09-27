import api from '../api';

/** Resolve stored avatar path (e.g. /uploads/avatars/x.jpg) to a full URL. */
export function getAvatarUrl(avatar) {
  if (!avatar) return null;
  if (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('data:')) {
    return avatar;
  }
  const base = api.defaults.baseURL?.replace(/\/$/, '') || '';
  return `${base}${avatar.startsWith('/') ? avatar : `/${avatar}`}`;
}
